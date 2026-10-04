import express from "express";

import {
  registerPatient,
  verifyOTP,
  getPatientProfile,
  logoutPatient,
  updatePatientProfile,
  commonLogin,
} from "../controllers/patientController.js";

import authMiddleware, {
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// ================= PATIENT =================

router.post("/register", registerPatient);

router.post("/verify-otp", verifyOTP);

router.post(
  "/login",
  (req, res, next) => {
    req.role = "patient";
    next();
  },
  commonLogin,
);

router.get("/logout", authMiddleware, logoutPatient);

router.get("/profile", authMiddleware, getPatientProfile);

router.put(
  "/profile-update",
  authMiddleware,
  singleUpload,
  updatePatientProfile,
);

export default router;
