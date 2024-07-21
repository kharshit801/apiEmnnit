// routes/professorSchedule.js
const express = require('express');
const getProfessorScheduleModel = require("../models/professorSchedule");
const router = express.Router();

// Get all schedules for a professor
router.get('/:professorId', async (req, res) => {
  try {
    const { professorId } = req.params;
    const ProfessorScheduleModel = await getProfessorScheduleModel(professorId);
    const schedules = await ProfessorScheduleModel.find().sort({ day: 1, time: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching professor schedules:', error);
    res.status(500).json({ error: 'Failed to fetch professor schedules' });
  }
});

// Add or update professor schedule
router.post('/:professorId', async (req, res) => {
  try {
    const { professorId } = req.params;
    const { day, subjectName, group, semester, venue, time } = req.body;
    const ProfessorScheduleModel = await getProfessorScheduleModel(professorId);
    const schedule = await ProfessorScheduleModel.findOneAndUpdate(
      { day, time },
      { day, subjectName, group, semester, venue, time },
      { upsert: true, new: true }
    );
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error adding/updating professor schedule:', error);
    res.status(500).json({ error: 'Failed to add/update professor schedule' });
  }
});

// Bulk update professor schedule
router.post('/:professorId/bulk', async (req, res) => {
  try {
    const { professorId } = req.params;
    const schedules = req.body;
    const ProfessorScheduleModel = await getProfessorScheduleModel(professorId);
    
    const operations = schedules.map(schedule => ({
      updateOne: {
        filter: { day: schedule.day, time: schedule.time },
        update: schedule,
        upsert: true
      }
    }));

    await ProfessorScheduleModel.bulkWrite(operations);
    res.status(201).json({ message: 'Schedules updated successfully' });
  } catch (error) {
    console.error('Error bulk updating professor schedules:', error);
    res.status(500).json({ error: 'Failed to bulk update professor schedules' });
  }
});

module.exports = router;