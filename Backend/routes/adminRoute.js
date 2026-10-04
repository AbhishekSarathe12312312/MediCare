import express from "express";

import {
  adminDeletePatient,
  adminGetPatients,
  adminGetProfile,
  adminUpdateProfile,
  getAdminDashboard,
  togglePatientStatus,
} from "../controllers/adminController.js";
import authMiddleware, {
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import { commonLogin } from "../controllers/patientController.js";
import { singleUpload } from "../middlewares/multer.js";
import {
  adminDeleteDoctor,
  adminGetDoctors,
  adminUpdateDoctor,
  toggleDoctorStatus,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin Login
router.post(
  "/login",
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  commonLogin,
);

// Admin Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRole("admin"),
  getAdminDashboard,
);

// =========================
// Admin Doctors
// =========================
router.get("/doctors", authMiddleware, authorizeRole("admin"), adminGetDoctors);
// =========================
// Admin Update Doctor
// =========================
router.put(
  "/doctors/:doctorId",
  authMiddleware,
  authorizeRole("admin"),
  singleUpload,
  adminUpdateDoctor,
);
// =========================
// Admin - Activate / Deactivate
// =========================
router.patch(
  "/doctors/:doctorId/status",
  authMiddleware,
  authorizeRole("admin"),
  toggleDoctorStatus,
);
// =========================
// Admin - Delete Doctor
// =========================
router.delete(
  "/doctors/:doctorId",
  authMiddleware,
  authorizeRole("admin"),
  adminDeleteDoctor,
);

// ================= ADMIN =================

// Admin - Get All Patients
router.get(
  "/patients",
  authMiddleware,
  authorizeRole("admin"),
  adminGetPatients,
);

// Admin - Activate / Deactivate Patient
router.patch(
  "/patients/:patientId/status",
  authMiddleware,
  authorizeRole("admin"),
  togglePatientStatus,
);

// Admin - Delete Patient
router.delete(
  "/patients/:patientId",
  authMiddleware,
  authorizeRole("admin"),
  adminDeletePatient,
);

// =========================
// Admin Profile
// =========================
router.get("/profile", authMiddleware, authorizeRole("admin"), adminGetProfile);

router.put(
  "/profile-update",
  authMiddleware,
  authorizeRole("admin"),
  singleUpload,
  adminUpdateProfile,
);

export default router;
