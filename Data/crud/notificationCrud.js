import Notification from "../models/notificationsModel.js";

export const createNotificationAsync = async (notificationData) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};
export const getAllNotificationsAsync = async (filter = {}) => {
  return await Notification.find(filter);
};
export const getNotificationByIdAsync = async (notificationId) => {
  return await Notification.findById(notificationId);
};
export const updateNotificationAsync = async (notificationId, updatedData) => {
  return await Notification.findByIdAndUpdate(notificationId, updatedData, { new: true });
};
export const deleteNotificationAsync = async (notificationId) => {
  return await Notification.findByIdAndDelete(notificationId);
};

 