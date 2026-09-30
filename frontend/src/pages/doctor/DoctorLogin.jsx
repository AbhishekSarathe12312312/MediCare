import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const DoctorLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        `${import.meta.env.VITE_API_URL}/api/doctor/login`,
        formData,
      );

      if (response.data.success) {
        const { token, doctor } = response.data;

        localStorage.setItem("doctorToken", token);
        localStorage.setItem("doctor", JSON.stringify(doctor));

        toast.success("Doctor login successful");

        navigate("/doctor/dashboard");
      }
    } catch (error) {
      console.error("DOCTOR LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Stethoscope size={32} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">MediCare</h1>

          <p className="mt-2 text-sm text-slate-400">Doctor Portal</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-white">Doctor Login</h2>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage your appointments and profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* Security Info */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <p className="text-xs leading-5 text-slate-400">
              Your doctor account is securely managed by MediCare
              administration.
            </p>
          </div>

          {/* Patient Login */}
          <div className="mt-6 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Are you a patient?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                Patient Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
