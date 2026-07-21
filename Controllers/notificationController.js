import { getMyNotifications, markNotificationAsRead } from '../Services/notificationService.js';
import asyncHandler from '../Middleware/asyncHandler.js';

export const getMyNotificationsController = asyncHandler(async (req, res, next) => {
  const notifications = await getMyNotifications(req.user.id);
  res.status(200).json({ success: true, data: notifications });
});

export const markNotificationAsReadController = asyncHandler(async (req, res, next) => {
  const notification = await markNotificationAsRead(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: notification });
});
