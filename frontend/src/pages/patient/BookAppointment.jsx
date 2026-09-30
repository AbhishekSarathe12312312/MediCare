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
            navigate("/patient/doctors");
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

      const token = localStorage.getItem("token");

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
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/patient/doctors")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to doctors
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-cyan-400">MediCare</p>

          <h1 className="text-3xl font-bold md:text-4xl">Book Appointment</h1>

          <p className="mt-2 text-slate-400">
            Choose a convenient date and time for your consultation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Doctor Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-cyan-500/10 text-cyan-400">
                {doctor.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Stethoscope size={40} />
                )}
              </div>

              <h2 className="mt-4 text-xl font-bold">{doctor.name}</h2>

              <p className="mt-1 text-sm text-cyan-400">
                {doctor.specialization}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {doctor.qualification}
              </p>
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-800 pt-5">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock size={18} className="text-cyan-400" />
                <span>{doctor.experience} years experience</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={18} className="text-cyan-400" />
                <span>{doctor.location || "Bhopal"}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-500">Consultation Fee</span>

                <span className="text-lg font-bold text-white">
                  ₹{doctor.consultationFee}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleBooking}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold">Appointment Details</h2>

              <p className="mt-1 text-sm text-slate-500">
                Select your preferred date and time.
              </p>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Appointment Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="date"
                      min={getTodayDate()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Appointment Time
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reason for Visit
                  <span className="ml-1 text-slate-600">(Optional)</span>
                </label>

                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Briefly describe your reason for visiting..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                />

                <p className="mt-1 text-right text-xs text-slate-600">
                  {reason.length}/500
                </p>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Consultation Fee
                  </span>

                  <span className="font-semibold">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="font-medium">Total</span>

                  <span className="text-lg font-bold text-cyan-400">
                    ₹{doctor.consultationFee}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={booking || !doctor.available}
                className="mt-6 w-full rounded-xl bg-cyan-500 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
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
