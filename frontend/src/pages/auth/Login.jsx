import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRound,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let response;

      // ================= PATIENT LOGIN =================
      if (formData.role === "patient") {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/patient/login`,
          {
            email: formData.email,
            password: formData.password,
          },
        );
      }

      // ================= DOCTOR LOGIN =================
      else if (formData.role === "doctor") {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/doctor/login`,
          {
            email: formData.email,
            password: formData.password,
          },
        );
      }

      // ================= ADMIN LOGIN =================
      else if (formData.role === "admin") {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/login`,
          {
            email: formData.email,
            password: formData.password,
          },
        );
      }

      // ================= INVALID ROLE =================
      else {
        toast.error("Invalid role");
        return;
      }

      // ================= LOGIN SUCCESS =================
      if (response.data.success) {
        const user = response.data.user;

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(user));

        console.log("STORED USER:", JSON.parse(sessionStorage.getItem("user")));

        window.dispatchEvent(new Event("authChanged"));

        toast.success(response.data.message || "Login successful");

        if (user.role === "patient") {
          navigate("/patient/dashboard");
        } else if (user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-3 py-5 sm:px-5 sm:py-6 lg:px-6 selection:bg-cyan-500 selection:text-gray-950">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
        {/* Logo / Header */}
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>

          <p className="text-[11px] sm:text-xs lg:text-sm text-gray-400 mt-1">
            Login to your MediCare account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl shadow-cyan-500/5">
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Role */}
            <div>
              <div className="mx-auto mb-2.5 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <Stethoscope
                  size={21}
                  className="text-cyan-400 sm:w-[22px] sm:h-[22px]"
                />
              </div>

              <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Login As
              </label>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {/* Patient */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "patient",
                    })
                  }
                  className={`flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 rounded-lg border transition cursor-pointer ${
                    formData.role === "patient"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm shadow-cyan-500/10"
                      : "bg-[#07111f] border-cyan-500/10 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-300"
                  }`}
                >
                  <UserRound size={16} className="sm:w-[18px] sm:h-[18px]" />

                  <span className="text-[10px] sm:text-[11px] font-semibold">
                    Patient
                  </span>
                </button>

                {/* Doctor */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "doctor",
                    })
                  }
                  className={`flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 rounded-lg border transition cursor-pointer ${
                    formData.role === "doctor"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm shadow-cyan-500/10"
                      : "bg-[#07111f] border-cyan-500/10 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-300"
                  }`}
                >
                  <Stethoscope size={16} className="sm:w-[18px] sm:h-[18px]" />

                  <span className="text-[10px] sm:text-[11px] font-semibold">
                    Doctor
                  </span>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "admin",
                    })
                  }
                  className={`flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 rounded-lg border transition cursor-pointer ${
                    formData.role === "admin"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm shadow-cyan-500/10"
                      : "bg-[#07111f] border-cyan-500/10 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-300"
                  }`}
                >
                  <ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px]" />

                  <span className="text-[10px] sm:text-[11px] font-semibold">
                    Admin
                  </span>
                </button>
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
                  className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-10 sm:h-11 bg-[#07111f] border border-cyan-500/10 rounded-lg pl-9 sm:pl-10 pr-3 text-[11px] sm:text-xs font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] sm:text-xs font-medium text-gray-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[10px] sm:text-[11px] text-cyan-400 hover:text-cyan-300 transition font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/60"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-10 sm:h-11 bg-[#07111f] border border-cyan-500/10 rounded-lg pl-9 sm:pl-10 pr-10 text-[11px] sm:text-xs font-medium text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/40 transition shadow-lg shadow-cyan-500/5"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-gray-950 font-bold rounded-lg transition shadow-lg shadow-cyan-500/20 text-[11px] sm:text-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-[10px] sm:text-[11px] text-gray-400 mt-4 sm:mt-5">
            Don&apos;t have an account?{" "}
            <Link
              to="/patient/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-[11px] text-gray-500 font-medium mt-4">
          &copy; 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
