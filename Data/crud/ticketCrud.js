import Ticket from "../models/ticketsModel.js";

export const createTicketAsync = async (ticketData) => {
  const ticket = new Ticket(ticketData);
  return await ticket.save();
};
export const getAllTicketsAsync = async (filter = {}) => {
  return await Ticket.find(filter);
};
export const getTicketByIdAsync = async (ticketId) => {
  return await Ticket.findById(ticketId);
};
export const updateTicketAsync = async (ticketId, updatedData) => {
return await Ticket.findByIdAndUpdate(ticketId, updatedData, { new: true, runValidators: true });
};
export const deleteTicketAsync = async (ticketId) => {
  return await Ticket.findByIdAndDelete(ticketId);
};

 