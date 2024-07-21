const express  = require('express');
const getclassScheduleModel = require("../models/classSchedule");
const router = express.Router();


//this route is used by mobile app to get class schedule for a particular day
router.get('/:group/:semester/:day', async (req, res) => {
    console.log("Request received in classSchedule API");
    try {
      const { group, semester, day } = req.params;
        console.log("group: ", group);
        console.log("semester: ", semester);
      const ClassScheduleModel = await getclassScheduleModel(group, semester);
      const classSchedule = await ClassScheduleModel.find({ day }).sort({ createdAt: -1 });
      console.log("classSchedule: ", classSchedule);
      res.status(200).json(classSchedule);
    } catch (err) {
      console.error("Error fetching class schedule:", err);
      res.status(500).json({ message: "Failed to fetch class schedule", error: err.message });
    }
  });
  
//this route is used by web-admin to get class schedule for a particular group and semester
  router.get("/:group/:semester",  async (req, res) => {
    try {
      const { group, semester } = req.params;
      const ClassSchedule = await getclassScheduleModel(group, semester);
      const schedules = await ClassSchedule.find().sort({ createdAt: -1 });
      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  });

  module.exports = router;
  