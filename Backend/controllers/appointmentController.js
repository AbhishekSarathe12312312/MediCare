import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";


// patient 
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // Check required fields
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor, appointment date and appointment time are required",
      });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check doctor availability
    if (!doctor.available) {
      return res.status(400).json({
        success: false,
        message: "Doctor is currently unavailable",
      });
    }

    // Convert date
    const selectedDate = new Date(appointmentDate);

    // Check valid date
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    // Prevent past date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past",
      });
    }

    // Check same doctor + date + time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: selectedDate,
      appointmentTime,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.userId,
      doctor: doctorId,
      appointmentDate: selectedDate,
      appointmentTime,
      reason: reason || "",
      consultationFee: doctor.consultationFee,
      status: "pending",
    });

    // Populate doctor details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate(
        "doctor",
        "name specialization qualification location profileImage consultationFee",
      )
      .populate("patient", "name email phone");

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("BOOK APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to book appointment",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.userId,
    })
      .populate(
        "doctor",
        "name specialization qualification location profileImage consultationFee",
      )
      .sort({ appointmentDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("GET MY APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointments",
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointment cannot be cancelled",
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("CANCEL APPOINTMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel appointment",
    });
  }
};


// doctor
// Get appointments for logged-in doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.userId,
    })
      .populate("patient", "name email phone gender dateOfBirth profileImage")
      .populate(
        "doctor",
        "name specialization qualification consultationFee location profileImage",
      )
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("GET DOCTOR APPOINTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch doctor appointments",
    });
  }
};

// Update appointment status by doctor
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointment cannot be updated",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointment cannot be updated",
      });
    }

    appointment.status = status;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone gender dateOfBirth profileImage")
      .populate(
        "doctor",
        "name specialization qualification consultationFee location profileImage",
      );

    return res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("UPDATE APPOINTMENT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update appointment status",
    });
  }
};


// =========================
// Admin - Get All Appointments
// =========================

export const adminGetAppointments = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    // Filter by appointment status
    if (status && status !== "all") {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate(
        "patient",
        "name email phone gender"
      )
      .populate(
        "doctor",
        "name specialization qualification"
      )
      .sort({ appointmentDate: -1, createdAt: -1 });

    let filteredAppointments = appointments;

    // Search patient or doctor
    if (search) {
      const searchText = search.toLowerCase();

      filteredAppointments =
        appointments.filter((appointment) => {
          const patientName =
            appointment.patient?.name?.toLowerCase() || "";

          const patientEmail =
            appointment.patient?.email?.toLowerCase() || "";

          const doctorName =
            appointment.doctor?.name?.toLowerCase() || "";

          const specialization =
            appointment.doctor?.specialization?.toLowerCase() || "";

          return (
            patientName.includes(searchText) ||
            patientEmail.includes(searchText) ||
            doctorName.includes(searchText) ||
            specialization.includes(searchText)
          );
        });
    }

    return res.status(200).json({
      success: true,
      appointments: filteredAppointments,
    });
  } catch (error) {
    console.error(
      "ADMIN GET APPOINTMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointments",
    });
  }
};