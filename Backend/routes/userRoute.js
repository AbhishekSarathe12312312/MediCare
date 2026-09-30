import express from "express";

import {
  registerPatient,
  verifyOTP,
  loginPatient,
  getPatientProfile,
  logoutPatient,
  updatePatientProfile,
  adminGetPatients,
  togglePatientStatus,
  adminDeletePatient,
} from "../controllers/userController.js";
import authMiddleware, {
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// for patient
router.post("/register", registerPatient);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginPatient);
router.get("/logout", authMiddleware, logoutPatient);
router.get("/profile", authMiddleware, getPatientProfile);
router.put("/profile-update", authMiddleware, updatePatientProfile);

// for admin
// Admin - Get All Patients
router.get(
  "/admin/patients",
  authMiddleware,
  authorizeRole("admin"),
  adminGetPatients,
);
// Admin - Activate / Deactivate Patient
router.patch(
  "/admin/patients/:patientId/status",
  authMiddleware,
  authorizeRole("admin"),
  togglePatientStatus,
);
// Admin - Delete Patient
router.delete(
  "/admin/patients/:patientId",
  authMiddleware,
  authorizeRole("admin"),
  adminDeletePatient
);
export default router;
