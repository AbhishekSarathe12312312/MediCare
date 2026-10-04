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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-3 py-5 sm:px-5 sm:py-6">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
        {/* Logo / Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500 mb-3">
            <ShieldCheck
              size={21}
              className="text-white sm:w-[23px] sm:h-[23px]"
            />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Verify your email
          </h1>

          <p className="text-[11px] sm:text-xs lg:text-sm text-slate-400 mt-1.5">
            Enter the OTP sent to your email
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* OTP */}
            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-slate-300 mb-1.5">
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
                className="w-full h-11 sm:h-12 bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 text-center text-lg sm:text-xl tracking-[0.4em] sm:tracking-[0.5em] text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full h-10 sm:h-11 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
            >
              Verify OTP
            </button>
          </form>

          {/* Resend OTP */}
          <p className="text-center text-[11px] sm:text-xs text-slate-400 mt-4 sm:mt-5">
            Didn't receive the OTP?
            <button
              type="button"
              className="ml-1 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              Resend OTP
            </button>
          </p>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full text-center text-[11px] sm:text-xs text-slate-500 hover:text-slate-300 mt-3 sm:mt-4 transition cursor-pointer"
          >
            ← Back to registration
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-[11px] text-slate-600 mt-4 sm:mt-5">
          © 2026 MediCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
