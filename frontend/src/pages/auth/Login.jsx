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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-3">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>

          <p className="text-slate-400 mt-2">Login to your MediCare account</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Login As
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Patient */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: "patient",
                    })
                  }
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition ${
                    formData.role === "patient"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <UserRound size={20} />
                  <span className="text-xs font-medium">Patient</span>
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
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition ${
                    formData.role === "doctor"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <Stethoscope size={20} />
                  <span className="text-xs font-medium">Doctor</span>
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
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition ${
                    formData.role === "admin"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <ShieldCheck size={20} />
                  <span className="text-xs font-medium">Admin</span>
                </button>
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

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </div>

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
                  placeholder="Enter your password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/patient/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
