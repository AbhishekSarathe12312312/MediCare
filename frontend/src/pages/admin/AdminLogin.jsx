import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        formData
      );

      if (response.data.success) {
        const { token, admin } = response.data;

        localStorage.setItem("adminToken", token);
        localStorage.setItem(
          "admin",
          JSON.stringify(admin)
        );

        toast.success("Admin login successful");

        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-4 py-8">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/20 mb-4">
            <Stethoscope
              size={32}
              className="text-blue-400"
            />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Medi<span className="text-blue-400">Care</span>
          </h1>

          <p className="text-gray-400 mt-2">
            Hospital Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d1a2b] border border-gray-800 rounded-2xl p-7 shadow-2xl">

          {/* Header */}
          <div className="mb-7">

            <div className="flex items-center gap-3 mb-2">

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ShieldCheck
                  size={21}
                  className="text-blue-400"
                />
              </div>

              <h2 className="text-xl font-semibold text-white">
                Admin Login
              </h2>

            </div>

            <p className="text-sm text-gray-400">
              Sign in to manage MediCare
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@medicare.com"
                  className="w-full bg-[#081321] border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none transition focus:border-blue-500"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-[#081321] border border-gray-700 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 outline-none transition focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

          {/* Other Login */}
          <div className="mt-7 pt-6 border-t border-gray-800 text-center">

            <p className="text-sm text-gray-500 mb-3">
              Are you a doctor?
            </p>

            <Link
              to="/doctor/login"
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Doctor Login
            </Link>

          </div>

        </div>

        {/* Security */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-600">
          <ShieldCheck size={14} />
          Secure Admin Access
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
