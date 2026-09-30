import express from "express";
import {
  adminDeleteDoctor,
  adminGetDoctors,
  adminUpdateDoctor,
  createDoctor,
  getDoctorProfile,
  getDoctors,
  loginDoctor,
  toggleDoctorStatus,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authMiddleware, {
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// =========================
// public - get Doctor
// =========================
router.get("/get-doctors", getDoctors);
// =========================
// Admin - Create Doctor
// =========================
router.post(
  "/create-doctor",
  authMiddleware,
  authorizeRole("admin"),
  singleUpload,
  createDoctor,
);

// =========================
// Doctor Login
// =========================
router.post("/login", loginDoctor);
// =========================
// Doctor Profile
// =========================
router.get(
  "/profile",
  authMiddleware,
  authorizeRole("doctor"),
  getDoctorProfile,
);
// =========================
// Doctor - Update Profile
// =========================
router.put(
  "/profile-update",
  authMiddleware,
  authorizeRole("doctor"),
  singleUpload,
  updateDoctorProfile,
);
// =========================
// Admin - Get Doctors
// =========================
router.get(
  "/admin/doctors",
  authMiddleware,
  authorizeRole("admin"),
  adminGetDoctors,
);
// =========================
// Admin - Update Doctor
// =========================
router.put(
  "/admin/doctors/:doctorId",
  authMiddleware,
  authorizeRole("admin"),
  singleUpload,
  adminUpdateDoctor,
);
// =========================
// Admin - Activate / Deactivate
// =========================
router.patch(
  "/admin/doctors/:doctorId/status",
  authMiddleware,
  authorizeRole("admin"),
  toggleDoctorStatus,
);
// =========================
// Admin - Delete Doctor
// =========================
router.delete(
  "/admin/doctors/:doctorId",
  authMiddleware,
  authorizeRole("admin"),
  adminDeleteDoctor,
);

export default router;
