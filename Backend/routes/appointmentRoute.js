import express from "express";
import authMiddleware, {
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import {
  adminGetAppointments,
  bookAppointment,
  cancelAppointment,
  getDoctorAppointments,
  getMyAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// patient
router.post(
  "/book-appointment",
  authMiddleware,
  authorizeRole("patient"),
  bookAppointment,
);
router.get(
  "/my-appointments",
  authMiddleware,
  authorizeRole("patient"),
  getMyAppointments,
);
router.put(
  "/cancel-appointment/:appointmentId",
  authMiddleware,
  authorizeRole("patient"),
  cancelAppointment,
);

// doctor
router.get(
  "/doctor-appointments",
  authMiddleware,
  authorizeRole("doctor"),
  getDoctorAppointments,
);
router.put(
  "/update-status/:appointmentId",
  authMiddleware,
  authorizeRole("doctor"),
  updateAppointmentStatus,
);
// Admin - Get All Appointments
router.get(
  "/admin/appointments",
  authMiddleware,
  authorizeRole("admin"),
  adminGetAppointments,
);

export default router;
