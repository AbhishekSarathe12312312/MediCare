import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import Appointment from "../models/appointmentModel.js";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../config/cloudinary.js";
import Admin from "../models/adminModel.js";

// =========================
// Admin Dashboard
// =========================
export const getAdminDashboard = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();

    const totalPatients = await Patient.countDocuments({
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
      doctor.available = available === true || available === "true";
    }

    if (isActive !== undefined) {
      doctor.isActive = isActive === true || isActive === "true";
    }

    // =========================
    // Profile Image
    // =========================

    if (req.file) {
      const fileUri = getDataUri(req.file);

      const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
        folder: "medicare/doctors",
        resource_type: "image",
      });

      doctor.profileImage = uploadResult.secure_url;
    }

    // =========================
    // Save Doctor
    // =========================

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("ADMIN UPDATE DOCTOR ERROR:", error);

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

    const patients = await Patient.find(filter)
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

    const patient = await Patient.findOne({
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
    console.error("TOGGLE PATIENT STATUS ERROR:", error);

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

    const patient = await Patient.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await Patient.findByIdAndDelete(patientId);

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("ADMIN DELETE PATIENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete patient",
    });
  }
};

// self admin ka

// Get Admin Profile
export const adminGetProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("ADMIN GET PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin profile",
    });
  }
};

// Update Admin Profile
export const adminUpdateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await Admin.findById(req.user.userId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update name
    if (name) {
      admin.name = name.trim();
    }

    // Update email
    if (email) {
      admin.email = email.toLowerCase().trim();
    }

    // Update profile image
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "medicare/admins",
      });

      admin.profileImage = cloudResponse.secure_url;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
      },
    });
  } catch (error) {
    console.error("ADMIN UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update admin profile",
    });
  }
};
