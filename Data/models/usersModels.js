import mongoose from "mongoose";
import validator from "validator";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
    },
    email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"]
    },
    password: {
    type: String,
    required: true,
    minlength: 6,
    },
    role: {
    type: String,
    enum: ["employee","technician", "admin"],
    default: "employee"
    },
    phone: {
    type: String,
    required: true
    },
    avatar: {
    type: String,
    default: "default-avatar.png"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
