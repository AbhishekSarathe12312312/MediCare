import Doctor from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { getDataUri } from "../utils/datauri.js";
import Appointment from "../models/appointmentModel.js";

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

// Register doctor
export const registerDoctor = async (req, res) => {
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
        message: "Please fill all required fields",
      });
    }

    // Check existing email
    const existingEmail = await Doctor.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // Check existing phone
    const existingPhone = await Doctor.findOne({
      phone: phone.trim(),
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this phone number already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const doctor = await Doctor.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      specialization: specialization.trim(),
      qualification: qualification.trim(),
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      location: location?.trim() || "Bhopal",
      about: about?.trim() || "",
      role: "doctor",
    });

    // Upload profile image
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "medicare/doctors",
      });

      doctor.profileImage = cloudResponse.secure_url;

      await doctor.save();
    }

    return res.status(201).json({
      success: true,
      message: "Doctor account created successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
        specialization: doctor.specialization,
        profileImage: doctor.profileImage,
      },
    });
  } catch (error) {
    console.error("DOCTOR REGISTRATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create doctor account",
    });
  }
};

// doctor get profile
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

// doctor update profile
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

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "medicare/doctors",
      });

      doctor.profileImage = cloudResponse.secure_url;
    }

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("UPDATE DOCTOR PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update doctor profile",
    });
  }
};

// doctor's patients
export const getDoctorPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.userId,
    })
      .populate("patient", "name email phone gender dateOfBirth profileImage")
      .sort({
        appointmentDate: -1,
        createdAt: -1,
      });

    const patientsMap = new Map();

    appointments.forEach((appointment) => {
      if (!appointment.patient) {
        return;
      }

      const patientId = appointment.patient._id.toString();

      if (!patientsMap.has(patientId)) {
        patientsMap.set(patientId, {
          _id: appointment.patient._id,
          name: appointment.patient.name,
          email: appointment.patient.email,
          phone: appointment.patient.phone,
          gender: appointment.patient.gender,
          dateOfBirth: appointment.patient.dateOfBirth,
          profileImage: appointment.patient.profileImage || "",
          totalAppointments: 1,
          lastAppointmentDate: appointment.appointmentDate,
        });
      } else {
        const patient = patientsMap.get(patientId);

        patient.totalAppointments += 1;
      }
    });

    const patients = Array.from(patientsMap.values());

    return res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("GET DOCTOR PATIENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch patients",
    });
  }
};
