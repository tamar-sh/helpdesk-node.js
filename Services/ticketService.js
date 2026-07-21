import { createTicketAsync, getAllTicketsAsync, getTicketByIdAsync, updateTicketAsync } from '../Data/crud/ticketCrud.js';
import { getUserByIdAsync, getAllUsersAsync } from '../Data/crud/userCrud.js';
import AppError from '../Middleware/appError.js';
import { sendNotification } from './notificationService.js';

export const createTicket = async (ticketData, employeeId, files = []) => {
    const ticketToCreate = {
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        employee: employeeId,
        attachments: files.map(file => file.path)
    }
    const ticket = await createTicketAsync(ticketToCreate);

    const admins = await getAllUsersAsync({ role: 'admin' });
    for (const admin of admins) {
        await sendNotification(admin._id, `New ticket opened: "${ticket.title}"`, ticket._id);
    }

    return ticket;
};


export const getAllTickets = async (user) => {
    const filter = {};
    if (user.role === 'employee') {
        filter.employee = user.id;
    }
    if (user.role === 'technician') {
        filter.technician = user.id;
    }
    return await getAllTicketsAsync(filter);
};

export const assertTicketAccess = (ticket, user) => {
  if (user.role === 'employee' && ticket.employee.toString() !== user.id) {
    throw new AppError('You do not have permission to access this ticket', 403);
  }
  if (user.role === 'technician' && (!ticket.technician || ticket.technician.toString() !== user.id)) {
    throw new AppError('You do not have permission to access this ticket', 403);
  }
};

export const getTicketById = async (ticketId, user) => {
  const ticket = await getTicketByIdAsync(ticketId);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }
  assertTicketAccess(ticket, user);
  return ticket;
};


export const assignTicket = async (ticketId, technicianId) => {
    const ticket = await getTicketByIdAsync(ticketId);
    if (!ticket) {
     throw new AppError('Ticket not found', 404);
    }
    const technician = await getUserByIdAsync(technicianId);
    if (!technician || technician.role !== 'technician') {
        throw new AppError("Assigned user is not a technician", 400);
    }
    const updatedTicket = await updateTicketAsync(ticketId, { technician: technicianId });

    await sendNotification(technicianId, `You have been assigned to ticket: "${ticket.title}"`, ticketId);

    return updatedTicket;
};

export const updateTicketStatus = async (ticketId, status, user) => {
    const ticket = await getTicketByIdAsync(ticketId);
    if (!ticket) {
     throw new AppError('Ticket not found', 404);
    }

    if (!ticket.technician || ticket.technician.toString() !== user.id) {
        throw new AppError('You do not have permission to update this ticket', 403);
    }

    const updatedTicket = await updateTicketAsync(ticketId, { status });

    await sendNotification(ticket.employee, `Your ticket "${ticket.title}" status changed to "${status}"`, ticketId);

    return updatedTicket;
};
