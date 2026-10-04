import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import patientRoute from "./routes/patientRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import adminRoute from "./routes/adminRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://medi-care-lemon-eta.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);

connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediCare backend is running",
  });
});

app.use("/api/patient", patientRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/payment", paymentRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
