const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const { connectNotifications, connectStudentDetails, connectClassSchedules,connectAttendanceDetails } = require('./dbConfig');
const ClassScheduleRouter = require("./routes/classSchedule");
const NotificationRouter = require("./routes/notification");
const UploadStudentsRouter = require("./routes/uploadStudents");
const getclassScheduleModel = require("./models/classSchedule");
const getAttendanceModel = require("./models/attendance");
const LoginRouter = require("./routes/login");
const ProfessorScheduleRouter = require("./routes/professorSchedule");

const ProfileRouter = require("./routes/profile");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 8000;
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

Promise.all([
  connectNotifications,
  connectStudentDetails,
  connectClassSchedules,
  connectAttendanceDetails
]).then(() => {
  console.log("All database connections established");

//Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected',socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected',socket.id);
  });
});

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}


//Routes

app.use('/api/classSchedule', ClassScheduleRouter);

app.use('/notifications', NotificationRouter);

app.use("/uploadStudents", UploadStudentsRouter);

app.use('/login',LoginRouter );

app.use('/api/profile', ProfileRouter);

app.post('/api/upload-weekly-schedule', upload.single('file'), async (req, res) => {
  try {
    const { group, semester, weeklySchedule } = req.body;
    let schedules = JSON.parse(weeklySchedule);

    if (req.file) {
      const filePath = req.file.path;
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        schedules = await parseCSV(filePath);
      } else if (fileExtension === 'json') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        schedules = JSON.parse(fileContent);
      }

      fs.unlinkSync(filePath); // Delete the uploaded file after processing
    }

    const ClassSchedule = await getclassScheduleModel(group, semester);

    // Clear existing schedules for this group and semester
    await ClassSchedule.deleteMany({ group, semester });

    // Convert the weekly schedule to the format your database expects
    const formattedSchedules = schedules.map(item => ({
      group,
      semester,
      day: item.day,
      subjectName: item.subject,
      venue: item.venue,
      time: item.startTime,
      duration: item.duration || 1
    }));

    await ClassSchedule.insertMany(formattedSchedules);
    console.log('Emitting scheduleUpdate', { group, semester });

    // Emit the update event
    io.emit('scheduleUpdate', { group, semester });

    res.json({ message: 'Weekly schedule uploaded successfully' });
  } catch (error) {
    console.error('Error uploading weekly schedule:', error);
    res.status(500).json({ error: 'Failed to upload weekly schedule', details: error.message });
  }
});





app.get("/api/attendance/:group/:semester", async (req, res) => {
  try {
    const { group, semester } = req.params;
    
    const AttendanceModel = await getAttendanceModel(group, semester);

    const attendanceRecords = await AttendanceModel.find({})
      .sort({ date: 1, regNo: 1 })
      .lean();

    const formattedRecords = attendanceRecords.map(record => ({
      regNo: record.regNo,
      name: record.name,
      date: record.date.toISOString().split('T')[0],
      status: record.status.toLowerCase() === 'present' ? 'Present' : 'Absent'
    }));

    res.status(200).json(formattedRecords);
  } catch (err) {
    console.error("Error fetching attendance data:", err);
    res.status(500).json({ message: "Failed to fetch attendance data", error: err.message });
  }
});

app.use("/api/professorSchedule", ProfessorScheduleRouter);




server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
}).catch((err) => {
console.error("Error connecting to databases:", err);
});
