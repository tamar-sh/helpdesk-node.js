import {createTicket, getAllTickets, getTicketById,assignTicket,updateTicketStatus} from '../Services/ticketService.js';
import asyncHandler from '../Middleware/asyncHandler.js';

export const createTicketController = asyncHandler(async (req, res, next) => {
    const employeeId = req.user.id; 
    const ticket = await createTicket(req.body, employeeId);
    res.status(201).json({ success: true, data: ticket });
});

export const getAllTicketsController = asyncHandler(async (req, res, next) => {
    const tickets = await getAllTickets(req.user);
    res.status(200).json({ success: true, data: tickets });
});

export const getTicketByIdController = asyncHandler(async (req, res, next) => {
    const ticketId = req.params.id;
    const ticket = await getTicketById(ticketId, req.user);
    res.status(200).json({ success: true, data: ticket });
});

export const assignTicketController = asyncHandler(async (req, res, next) => {
    const ticketId = req.params.id;
    const technicianId = req.body.technicianId;
    const updatedTicket = await assignTicket(ticketId, technicianId);
    res.status(200).json({ success: true, data: updatedTicket });
});

export const updateTicketStatusController = asyncHandler(async (req, res, next) => {
    const ticketId = req.params.id;
    const status = req.body.status;
    const updatedTicket = await updateTicketStatus(ticketId, status, req.user);
    res.status(200).json({ success: true, data: updatedTicket });
});
