import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
    },
    description: {
    type: String,
    required: true
    },
    category: {
    type: String,
    },
    priority: {
    type: String,
    enum: ["Low", "Medium", "High","Critical"],
    default: "Low"
    },
    status: {
    type: String,
    enum: ["Open", "In Progress", "Waiting for Employee", "Resolved", "Closed"],
    default: "Open"
    },
    employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    attachments: [{
    type: String
    }]

}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);