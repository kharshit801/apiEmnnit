const mongoose = require('mongoose');
const { connectClassSchedules } = require('../dbConfig');

const classScheduleSchema = new mongoose.Schema({
  group: { type: String, required: true },
  semester: { type: String, required: true },
  day: { type: String, required: true },
  subjectName: { type: String, required: true },
  venue: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 1 },
}, { timestamps: true });

const getclassScheduleModel = async (group, semester) => {
  const connection = await connectClassSchedules;
  const collectionName = `${group}_${semester}_classSchedule`;
  return connection.model(collectionName, classScheduleSchema);
};

module.exports = getclassScheduleModel;
