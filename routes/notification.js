const express = require('express');
const getNotificationModel = require("../models/notification");
const router = express.Router();


router.get("/:group/:semester", async (req,res) =>{
    try {
        const { group, semester } = req.params;
        const NotificationModel = await getNotificationModel(group, semester);
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
      }
});

module.exports = router;


