const express = require('express');
const getStudentModel = require("../models/student");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const students = req.body;
        await getStudentModel.insertMany(students);
        res.status(200).json({messages: "Students data uploaded successfully"});
        
    } catch (error) {
        res.status(500).json({messages: "Failed to upload student data", error: error.message});
        console.log("Error in uploading student details", error);
        
    }
})

module.exports = router;