import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const PatientRegister = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/patient/register`,
        formData,
      );

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/verify-otp", {
          state: {
            registrationData: formData,
          },
        });
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-3 py-4 sm:px-5 sm:py-6 lg:px-6 selection:bg-cyan-500 selection:text-gray-950">
      <div className="w-full max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>

          <p className="text-[11px] sm:text-xs lg:text-sm text-gray-400 mt-1.5">
            Join MediCare as a patient
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xl shadow-cyan-500/5">
          <form onSubmit={handleSubmit}>
            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5">
              {/* Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full h-10 sm:h-11 bg-[#07111f] border border-cyan-500/10 rounded-lg py-2 pl-9 pr-3 text-[11px] sm:text-xs font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] sm:text-xs font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full h-10 sm:h-11 bg-[#07111f] border border-cyan-500/10 rounded-lg py-2 pl-9 pr-3 text-[11px] sm:text-xs font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] sm:text-xs font-medium text-gray-300 mb-1.5">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full h-10 sm:h-11 bg-[#07111f] border border-cyan-500/10 rounded-lg py-2 pl-9 pr-3 text-[11px] sm:text-xs font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] sm:text-xs font-medium text-gray-300 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full h-10 sm:h-11 bg-[#07111f] border border-cyan-500/10 rounded-lg py-2 pl-9 pr-9 text-[11px] sm:text-xs font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-gray-950 font-bold rounded-lg transition shadow-lg shadow-cyan-500/20 text-[11px] sm:text-xs cursor-pointer disabled:cursor-not-allowed mt-5 sm:mt-6"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-[11px] text-gray-500 font-medium mt-3 sm:mt-4">
          &copy; 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PatientRegister;
