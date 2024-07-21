const mongoose = require('mongoose');
const { connectStudentDetails } = require('../dbConfig');

const studentSchema = new mongoose.Schema({

  regNo: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  group: { type: String, required: true },
  semester: { type: Number, required: true },
  email: {type: String, required: true},
  password: {type: String, required: true},
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}
});

let Student;

connectStudentDetails.then(connection => {
  Student = connection.model('Student', studentSchema);
});

module.exports = {
  getModel: () => Student
};