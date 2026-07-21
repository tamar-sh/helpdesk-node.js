import { createTicketAsync, getAllTicketsAsync, getTicketByIdAsync, updateTicketAsync } from '../Data/crud/ticketCrud.js';
import { getUserByIdAsync } from '../Data/crud/userCrud.js';
import AppError from '../Middleware/appError.js';

export const createTicket= async (ticketData, employeeId) => {
    const ticketToCreate = {
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        employee: employeeId,
        attachments: ticketData.attachments || []
    }
    return await createTicketAsync(ticketToCreate);
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
    return await updateTicketAsync(ticketId, { technician: technicianId });
};

export const updateTicketStatus = async (ticketId, status, user) => {
    const ticket = await getTicketByIdAsync(ticketId);
    if (!ticket) {
     throw new AppError('Ticket not found', 404);
    }

    if (!ticket.technician || ticket.technician.toString() !== user.id) {
        throw new AppError('You do not have permission to update this ticket', 403);
    }

    return await updateTicketAsync(ticketId, { status });
};
