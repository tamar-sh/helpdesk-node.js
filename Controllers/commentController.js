import { createCommentServiceAsync, getCommentsForTicketServiceAsync } from '../Services/commentService.js';
import asyncHandler from '../Middleware/asyncHandler.js';

export const createCommentController = asyncHandler(async (req, res, next) => {
  const { ticketId, message } = req.body;
  const comment = await createCommentServiceAsync(ticketId, message, req.user);
  res.status(201).json({ success: true, data: comment });
});

export const getCommentsController = asyncHandler(async (req, res, next) => {
  const comments = await getCommentsForTicketServiceAsync(req.params.ticketId, req.user);
  res.status(200).json({ success: true, data: comments });
});
