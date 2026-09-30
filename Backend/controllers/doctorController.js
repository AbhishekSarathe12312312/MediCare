import Doctor from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { getDataUri } from "../utils/datauri.js";

// patient
export const getDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          specialization: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (specialization && specialization !== "All") {
      filter.specialization = specialization;
    }

    const doctors = await Doctor.find(filter)
      .select("-email -phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("GET DOCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch doctors",
    });
  }
};

// create doctor
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      qualification,
      experience,
      consultationFee,
      location,
      about,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !specialization ||
      !qualification ||
      experience === undefined ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Check email
    const existingEmail = await Doctor.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Doctor email already registered",
      });
    }

    // Check phone
    const existingPhone = await Doctor.findOne({
      phone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Doctor phone number already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Upload profile image to Cloudinary
    let profileImage = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse =
        await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "medicare/doctors",
          }
        );

      profileImage = cloudResponse.secure_url;
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "doctor",
      specialization,
      qualification,
      experience,
      consultationFee,
      location: location || "Bhopal",
      profileImage,
      about: about || "",
      available: true,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        location: doctor.location,
        profileImage: doctor.profileImage,
      },
    });
  } catch (error) {
    console.error(
      "CREATE DOCTOR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create doctor",
    });
  }
};

// login doctor
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find doctor
    const doctor = await Doctor.findOne({
      email,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: doctor._id,
        role: doctor.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Doctor login successful",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        location: doctor.location,
        profileImage: doctor.profileImage,
        available: doctor.available,
      },
    });
  } catch (error) {
    console.error("DOCTOR LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get logged-in doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.userId).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("GET DOCTOR PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch doctor profile",
    });
  }
};

// Update logged-in doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      location,
      about,
      available,
    } = req.body;

    const doctor = await Doctor.findById(req.user.userId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check duplicate phone
    if (phone && phone !== doctor.phone) {
      const existingDoctor = await Doctor.findOne({
        phone,
        _id: { $ne: doctor._id },
      });

      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message: "Phone number already registered",
        });
      }

      doctor.phone = phone;
    }

    if (name !== undefined) {
      doctor.name = name;
    }

    if (specialization !== undefined) {
      doctor.specialization = specialization;
    }

    if (qualification !== undefined) {
      doctor.qualification = qualification;
    }

    if (experience !== undefined) {
      doctor.experience = experience;
    }

    if (consultationFee !== undefined) {
      doctor.consultationFee = consultationFee;
    }

    if (location !== undefined) {
      doctor.location = location;
    }

    if (about !== undefined) {
      doctor.about = about;
    }

    if (available !== undefined) {
      doctor.available = available;
    }

    // Upload new profile image
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse =
        await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "medicare/doctors",
          }
        );

      doctor.profileImage =
        cloudResponse.secure_url;
    }

    await doctor.save();

    const updatedDoctor = await Doctor.findById(
      doctor._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(
      "UPDATE DOCTOR PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update doctor profile",
    });
  }
};

// =========================
// Admin - Get All Doctors
// =========================
export const adminGetDoctors = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {};

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
          specialization: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const doctors = await Doctor.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("ADMIN GET DOCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch doctors",
    });
  }
};

// =========================
// Admin - Update Doctor
// =========================
export const adminUpdateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const {
      name,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      location,
      about,
      available,
      isActive,
    } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // =========================
    // Duplicate Phone Check
    // =========================

    if (phone && phone !== doctor.phone) {
      const existingDoctor = await Doctor.findOne({
        phone,
        _id: { $ne: doctor._id },
      });

      if (existingDoctor) {
        return res.status(409).json({
          success: false,
          message: "Phone number already registered",
        });
      }

      doctor.phone = phone;
    }

    // =========================
    // Update Basic Information
    // =========================

    if (name !== undefined) {
      doctor.name = name;
    }

    if (specialization !== undefined) {
      doctor.specialization = specialization;
    }

    if (qualification !== undefined) {
      doctor.qualification = qualification;
    }

    if (experience !== undefined) {
      doctor.experience = Number(experience);
    }

    if (consultationFee !== undefined) {
      doctor.consultationFee = Number(consultationFee);
    }

    if (location !== undefined) {
      doctor.location = location;
    }

    if (about !== undefined) {
      doctor.about = about;
    }

    // =========================
    // Boolean Values
    // =========================

    if (available !== undefined) {
      doctor.available =
        available === true || available === "true";
    }

    if (isActive !== undefined) {
      doctor.isActive =
        isActive === true || isActive === "true";
    }

    // =========================
    // Profile Image
    // =========================

    if (req.file) {
      const fileUri = getDataUri(req.file);

      const uploadResult =
        await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "medicare/doctors",
            resource_type: "image",
          }
        );

      doctor.profileImage =
        uploadResult.secure_url;
    }

    // =========================
    // Save Doctor
    // =========================

    await doctor.save();

    const updatedDoctor =
      await Doctor.findById(doctor._id)
        .select("-password");

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(
      "ADMIN UPDATE DOCTOR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update doctor",
    });
  }
};

// =========================
// Admin - Toggle Doctor Status
// =========================
export const toggleDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isActive = !doctor.isActive;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: doctor.isActive
        ? "Doctor activated successfully"
        : "Doctor deactivated successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        isActive: doctor.isActive,
      },
    });
  } catch (error) {
    console.error("TOGGLE DOCTOR STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update doctor status",
    });
  }
};

// =========================
// Admin - Delete Doctor
// =========================
export const adminDeleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(doctorId);

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("ADMIN DELETE DOCTOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete doctor",
    });
  }
};
