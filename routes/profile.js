const express = require('express');
const router = express.Router();
const { getModel } = require('../models/student');

router.get('/:regNo', async (req, res) => {
  try {
    const Student = getModel();
    const student = await Student.findOne({ regNo: req.params.regNo });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove sensitive information
    const profile = {
      regNo: student.regNo,
      name: student.name,
      group: student.group,
      semester: student.semester,
      email: student.email
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;