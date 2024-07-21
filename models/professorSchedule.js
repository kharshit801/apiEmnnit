const mongoose = require('mongoose');
const { connectClassSchedulesProff } = require('../dbConfig');


const professorScheduleSchema = new mongoose.Schema({
  day: String,
  time: String,
  subjectName: String,
  group: String,
  semester: String,
  venue: String
});

const getProfessorScheduleModel = async (professorId) => {

  const connection = await connectClassSchedulesProff;
  return connection.model(`Schedule_${professorId}`, professorScheduleSchema);
};

module.exports = getProfessorScheduleModel;