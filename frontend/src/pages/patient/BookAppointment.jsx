import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctor/get-doctors`,
        );

        if (response.data.success) {
          const selectedDoctor = response.data.doctors.find(
            (item) => item._id === doctorId,
          );

          if (!selectedDoctor) {
            toast.error("Doctor not found");
            navigate("/find-doctors");
            return;
          }

          setDoctor(selectedDoctor);
        }
      } catch (error) {
        console.error("GET DOCTOR ERROR:", error);
        toast.error("Unable to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, navigate]);

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select date and time");
      return;
    }

    try {
      setBooking(true);

      const token = sessionStorage.getItem("token");

      // --------------------------------
      // STEP 1: CREATE RAZORPAY ORDER
      // --------------------------------
      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-payment`,
        {
          amount: doctor.consultationFee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!paymentResponse.data.success) {
        toast.error("Unable to create payment");
        setBooking(false);
        return;
      }

      const order = paymentResponse.data.order;

      // --------------------------------
      // STEP 2: OPEN RAZORPAY CHECKOUT
      // --------------------------------
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,

        name: "MediCare",
        description: `Consultation with Dr. ${doctor.name}`,

        order_id: order.id,

        handler: async function (paymentResult) {
          try {
            // --------------------------------
            // STEP 3: VERIFY PAYMENT
            // --------------------------------
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                razorpay_order_id: paymentResult.razorpay_order_id,

                razorpay_payment_id: paymentResult.razorpay_payment_id,

                razorpay_signature: paymentResult.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!verifyResponse.data.success) {
              toast.error("Payment verification failed");
              setBooking(false);
              return;
            }

            // --------------------------------
            // STEP 4: CREATE APPOINTMENT
            // --------------------------------
            const appointmentResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/appointment/book-appointment`,
              {
                doctorId,
                appointmentDate,
                appointmentTime,
                reason,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (appointmentResponse.data.success) {
              toast.success("Payment successful & appointment booked");

              navigate("/patient/appointments");
            }
          } catch (error) {
            console.error("PAYMENT VERIFICATION / APPOINTMENT ERROR:", error);

            toast.error(
              error.response?.data?.message ||
                "Unable to complete appointment booking",
            );

            setBooking(false);
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#06b6d4",
        },

        modal: {
          ondismiss: function () {
            setBooking(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("PAYMENT ERROR:", error);

      toast.error(error.response?.data?.message || "Unable to start payment");

      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

          <p className="text-sm text-slate-400">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8 lg:px-12 mt-18 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/find-doctors")}
          className="group mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:border-cyan-500/40 hover:text-white cursor-pointer"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to doctors
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            MediCare Booking Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Book Appointment
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Choose a convenient date and time for your consultation with the
            specialist.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Doctor Details */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/30 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
                {doctor.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Stethoscope size={38} />
                )}
              </div>

              <h2 className="mt-4 text-lg font-bold text-white">
                {doctor.name}
              </h2>

              <p className="mt-0.5 text-xs font-semibold text-cyan-400">
                {doctor.specialization}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {doctor.qualification}
              </p>
            </div>

            <div className="mt-6 space-y-3.5 border-t border-slate-800/80 pt-5 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                  <Clock size={14} />
                </div>
                <span>
                  <strong className="text-white">
                    {doctor.experience} Years
                  </strong>{" "}
                  experience
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                  <MapPin size={14} />
                </div>
                <span className="truncate">{doctor.location || "Bhopal"}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 px-3.5 py-3 mt-4">
                <span className="text-slate-400 font-medium">
                  Consultation Fee
                </span>
                <span className="text-sm font-bold text-white">
                  ₹{doctor.consultationFee}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleBooking}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-xl shadow-slate-950/30"
            >
              <h2 className="text-lg font-bold text-white">
                Appointment Details
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Select your preferred date and time slot for the visit.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2 text-xs">
                {/* Date */}
                <div>
                  <label className="mb-2 block font-medium text-slate-300">
                    Appointment Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/70"
                    />

                    <input
                      type="date"
                      min={getTodayDate()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-xs text-white outline-none transition focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="mb-2 block font-medium text-slate-300">
                    Appointment Time
                  </label>

                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/70"
                    />

                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-xs text-white outline-none transition focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-5 text-xs">
                <label className="mb-2 block font-medium text-slate-300">
                  Reason for Visit
                  <span className="ml-1 text-slate-500">(Optional)</span>
                </label>

                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Briefly describe your symptoms or reason for visiting..."
                  className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
                />

                <p className="mt-1 text-right text-[10px] text-slate-500">
                  {reason.length}/500
                </p>
              </div>

              {/* Summary */}
              <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Consultation Fee</span>
                  <span className="font-medium text-white">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                  <span className="font-bold text-white">Total Payable</span>
                  <span className="text-sm font-bold text-cyan-400">
                    ₹{doctor.consultationFee}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={booking || !doctor.available}
                className="mt-6 w-full rounded-xl bg-cyan-500 py-3.5 text-xs font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400 hover:shadow-cyan-400/40 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none cursor-pointer"
              >
                {booking
                  ? "Processing Payment..."
                  : "Pay & Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
