import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
import Admin from "../models/adminModel.js";

import OTP from "../models/otpModel.js";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";
import cloudinary from "../config/cloudinary.js";
import { getDataUri } from "../utils/datauri.js";

// ================= COMMON LOGIN =================
export const commonLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { role } = req;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user;

    if (role === "patient") {
      user = await Patient.findOne({ email, role: "patient" });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email, role: "doctor" });
    } else if (role === "admin") {
      user = await Admin.findOne({ email, role: "admin" });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

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
        profileImage: user.profileImage || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("COMMON LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= PATIENT REGISTER =================
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
    const existingEmail = await Patient.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check existing phone
    const existingPhone = await Patient.findOne({ phone });

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
    const patient = await Patient.create({
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
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        role: patient.role,
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

// ================= PATIENT LOGIN =================
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
    const patient = await Patient.findOne({
      email,
      role: "patient",
    });

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check active status
    if (!patient.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: patient._id,
        role: patient.role,
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
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        role: patient.role,
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

// ================= PATIENT PROFILE =================
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.userId).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: patient,
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

    const patient = await Patient.findById(req.user.userId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (name !== undefined) {
      patient.name = name.trim();
    }

    if (phone !== undefined) {
      patient.phone = phone.trim();
    }

    if (gender !== undefined) {
      patient.gender = gender;
    }

    if (dateOfBirth !== undefined) {
      patient.dateOfBirth = dateOfBirth;
    }

    if (address !== undefined) {
      patient.address = address.trim();
    }

    // Upload new profile image
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "medicare/patient",
      });

      patient.profileImage = cloudResponse.secure_url;
    }

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        address: patient.address,
        profileImage: patient.profileImage,
        role: patient.role,
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

// ================= PATIENT LOGOUT =================
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



