import {assertTicketAccess} from './ticketService.js';
import {getTicketByIdAsync} from '../Data/crud/ticketCrud.js';
import AppError from '../Middleware/appError.js';
import { createCommentAsync, getAllCommentsAsync} from '../Data/crud/commentCrud.js';

export const createCommentServiceAsync = async (ticketId, message, user) => {
  const ticket = await getTicketByIdAsync(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }
  assertTicketAccess(ticket, user);
return await createCommentAsync({ ticket: ticketId, message, user: user.id });
};

export const getCommentsForTicketServiceAsync = async (ticketId, user) => {
  const ticket = await getTicketByIdAsync(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }
  assertTicketAccess(ticket, user);
  return await getAllCommentsAsync({ ticket: ticketId });
};
