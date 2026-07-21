import {assertTicketAccess} from './ticketService.js';
import {getTicketByIdAsync} from '../Data/crud/ticketCrud.js';
import AppError from '../Middleware/appError.js';
import { createCommentAsync, getAllCommentsAsync} from '../Data/crud/commentCrud.js';
import { sendNotification } from './notificationService.js';

export const createCommentServiceAsync = async (ticketId, message, user) => {
  const ticket = await getTicketByIdAsync(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }
  assertTicketAccess(ticket, user);
  const comment = await createCommentAsync({ ticket: ticketId, message, user: user.id });

  const recipients = [ticket.employee, ticket.technician].filter(
    (id) => id && id.toString() !== user.id
  );
  for (const recipientId of recipients) {
    await sendNotification(recipientId, `New comment on ticket "${ticket.title}"`, ticketId);
  }

  return comment;
};

export const getCommentsForTicketServiceAsync = async (ticketId, user) => {
  const ticket = await getTicketByIdAsync(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }
  assertTicketAccess(ticket, user);
  return await getAllCommentsAsync({ ticket: ticketId });
};
