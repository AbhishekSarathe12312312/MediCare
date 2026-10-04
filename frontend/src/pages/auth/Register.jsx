import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500 mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>

          <h1 className="text-3xl font-bold text-white">Create your account</h1>

          <p className="text-slate-400 mt-2">Join MediCare as a patient</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
