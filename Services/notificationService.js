import { createNotificationAsync, getAllNotificationsAsync, getNotificationByIdAsync, updateNotificationAsync } from '../Data/crud/notificationCrud.js';
import { getIO } from '../socket.js';
import AppError from '../Middleware/appError.js';

export const sendNotification = async (userId, message, ticketId = null) => {
  const notification = await createNotificationAsync({
    user: userId,
    message,
    ticket: ticketId
  });

  getIO().to(userId.toString()).emit('notification', notification);

  return notification;
};

export const getMyNotifications = async (userId) => {
  return await getAllNotificationsAsync({ user: userId });
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await getNotificationByIdAsync(notificationId);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  if (notification.user.toString() !== userId) {
    throw new AppError('You do not have permission to update this notification', 403);
  }
  return await updateNotificationAsync(notificationId, { isRead: true });
};
