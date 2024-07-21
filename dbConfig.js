const mongoose = require('mongoose');

const connectNotifications = mongoose.createConnection(process.env.MONGODB_NOTIFICATION);
const connectStudentDetails = mongoose.createConnection(process.env.MONGODB_STUDENT);
const connectClassSchedules = mongoose.createConnection(process.env.MONGODB_CLASSSCHEDULE);
const connectAttendanceDetails = mongoose.createConnection(process.env.MOBGODB_ATTENDANCE)
const waitForConnection = (connection) => {
  return new Promise((resolve, reject) => {
    connection.on('connected', () => resolve(connection));
    connection.on('error', (err) => reject(err));
  });
};

module.exports = { 
  connectNotifications: waitForConnection(connectNotifications),
  connectStudentDetails: waitForConnection(connectStudentDetails),
  connectClassSchedules: waitForConnection(connectClassSchedules),
  connectAttendanceDetails: waitForConnection(connectAttendanceDetails),
};