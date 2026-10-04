import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "./models/adminModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@medicare.com";
    const password = "123123";

    const existingAdmin = await Admin.findOne({
      email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: "MediCare Admin",
      email,
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    process.exit(1);
  }
};

createAdmin();
