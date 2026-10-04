import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const registrationData = location.state?.registrationData;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/patient/verify-otp`,
        {
          ...registrationData,
          otp,
        },
      );

      if (response.data.success) {
        toast.success("Registration successful");

        navigate("/login");
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500 mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">Verify your email</h1>

          <p className="text-slate-400 mt-2">
            Enter the OTP sent to your email
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-center text-xl tracking-[0.5em] text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition"
            >
              Verify OTP
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Didn't receive the OTP?
            <button
              type="button"
              className="ml-1 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Resend OTP
            </button>
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full text-center text-sm text-slate-500 hover:text-slate-300 mt-4"
          >
            ← Back to registration
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
