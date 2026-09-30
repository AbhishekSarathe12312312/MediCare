import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";

// ================= PATIENT REGISTER PATIENT =================
export const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check existing phone
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expiry = 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Remove previous OTP
    await OTP.deleteMany({ email });

    // Save OTP
    await OTP.create({
      email,
      otpHash,
      expiresAt,
      attempts: 0,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("REGISTER PATIENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
    });
  }
};
// ================= PATIENT VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    if (!name || !email || !phone || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Maximum attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts",
      });
    }

    // Compare OTP
    const isValidOTP = await bcrypt.compare(otp.toString(), otpRecord.otpHash);

    if (!isValidOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient AFTER OTP verification
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "patient",
    });

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};
// ================= PATIENT LOGIN PATIENT =================
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find patient
    const user = await User.findOne({
      email,
      role: "patient",
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN PATIENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// ================= PATIENT LOGOUT PATIENT =================
export const logoutPatient = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to logout",
    });
  }
};
// ================= PATIENT PROFILE  =================
export const getPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};
// ================= PATIENT UPDATE PROFILE =================
export const updatePatientProfile = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth, address } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (gender !== undefined) user.gender = gender;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (address !== undefined) user.address = address.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

// =========================
// Admin - Get All Patients
// =========================
export const adminGetPatients = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {
      role: "patient",
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const patients = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("ADMIN GET PATIENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch patients",
    });
  }
};

// =========================
// Admin - Toggle Patient Status
// =========================
export const togglePatientStatus = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.isActive = !patient.isActive;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: patient.isActive
        ? "Patient activated successfully"
        : "Patient deactivated successfully",
      patient: {
        id: patient._id,
        name: patient.name,
        isActive: patient.isActive,
      },
    });
  } catch (error) {
    console.error(
      "TOGGLE PATIENT STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update patient status",
    });
  }
};

// =========================
// Admin - Delete Patient
// =========================

export const adminDeletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await User.findByIdAndDelete(patientId);

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error(
      "ADMIN DELETE PATIENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete patient",
    });
  }
};


