import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/adminModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Appointment from "../models/appointmentModel.js";

// =========================
// Admin Login
// =========================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email,
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: admin._id,
        role: admin.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// Admin Dashboard
// =========================
export const getAdminDashboard = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();

    const totalPatients = await User.countDocuments({
      role: "patient",
    });

    const totalAppointments = await Appointment.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });

    const confirmedAppointments = await Appointment.countDocuments({
      status: "confirmed",
    });

    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });

    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled",
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard",
    });
  }
};
