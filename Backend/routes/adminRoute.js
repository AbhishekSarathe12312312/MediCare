import express from "express";

import { getAdminDashboard, loginAdmin } from "../controllers/adminController.js";
import authMiddleware, { authorizeRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

// Admin Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRole("admin"),
  getAdminDashboard,
);

export default router;
