import express from "express";
import {
  getDoctorPatients,
  getDoctorProfile,
  getDoctors,
  registerDoctor,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authMiddleware, {
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { commonLogin } from "../controllers/patientController.js";

const router = express.Router();

// =========================
// public - get Doctor
// =========================
router.get("/get-doctors", getDoctors);

// =========================
// Register Doctor
// =========================
router.post("/register", singleUpload, registerDoctor);

// =========================
// Doctor Login
// =========================
router.post(
  "/login",
  (req, res, next) => {
    req.role = "doctor";
    next();
  },
  commonLogin,
);
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
// Doctor's Patients
// =========================
router.get(
  "/patients",
  authMiddleware,
  authorizeRole("doctor"),
  getDoctorPatients,
);

export default router;
