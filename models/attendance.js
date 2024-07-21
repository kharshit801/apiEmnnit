const mongoose = require('mongoose');
const { connectAttendanceDetails } = require('../dbConfig');

const attendanceSchema = new mongoose.Schema({
    regNo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent'] // Restrict status to these values
    },
    group: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create a compound index for efficient querying
attendanceSchema.index({ group: 1, semester: 1, date: 1, regNo: 1 });

const getAttendanceModel = async (group, semester) => {
    const connection = await connectAttendanceDetails;
    const collectionName = `${group}_${semester}_attendance`;
    
    // Check if the model already exists to prevent OverwriteModelError
    if (connection.models[collectionName]) {
        return connection.model(collectionName);
    }
    
    return connection.model(collectionName, attendanceSchema);
};

module.exports = getAttendanceModel;