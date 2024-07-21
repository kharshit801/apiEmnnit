const mongoose = require('mongoose');
const { connectNotifications } = require('../dbConfig');

const notificationSchema = new mongoose.Schema({
  group: { type: String, required: true },
  semester: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  Date: { type: Date, default: Date.now },
});

const getNotificationModel = async (group, semester) => {
  const connection = await connectNotifications;
  const collectionName = `${group}_${semester}_Notifications`;
  return connection.model(collectionName, notificationSchema);
};

module.exports = getNotificationModel;