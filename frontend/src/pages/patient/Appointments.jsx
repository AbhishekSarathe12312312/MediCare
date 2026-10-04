import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Appointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment/my-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("GET APPOINTMENTS ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to fetch appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

          <p className="text-sm text-slate-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/appointment/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Appointment cancelled successfully");

        // Refresh appointment list
        fetchAppointments();
      }
    } catch (error) {
      console.error("CANCEL APPOINTMENT ERROR:", error);

      toast.error(
        error.response?.data?.message || "Unable to cancel appointment",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8 lg:px-12 mt-18 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="group mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:border-cyan-500/40 hover:text-white cursor-pointer"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Dashboard
          </button>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-sm ml-2 sm:ml-0">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            MediCare Consultations
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            View and manage your upcoming and previous scheduled consultations.
          </p>
        </div>

        {/* Empty State */}
        {appointments.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 py-16 text-center shadow-xl shadow-slate-950/30">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-500">
              <CalendarDays size={32} />
            </div>

            <h2 className="text-lg font-bold text-white">
              No appointments yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
              You haven't booked any appointments yet. Find a doctor and
              schedule your first consultation.
            </p>

            <button
              onClick={() => navigate("/find-doctors")}
              className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400 hover:shadow-cyan-400/40 active:scale-95 cursor-pointer"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-slate-950/40"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  {/* Doctor */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
                      {appointment.doctor?.profileImage ? (
                        <img
                          src={appointment.doctor.profileImage}
                          alt={appointment.doctor.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Stethoscope size={26} />
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {appointment.doctor?.name || "Doctor"}
                      </h2>

                      <p className="mt-0.5 text-xs font-semibold text-cyan-400">
                        {appointment.doctor?.specialization}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {appointment.doctor?.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusStyle(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-6 grid gap-4 border-t border-slate-800/80 pt-5 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <p className="text-slate-400 font-medium">Date</p>

                    <div className="mt-2 flex items-center gap-2 text-white font-semibold">
                      <CalendarDays size={15} className="text-cyan-400" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <p className="text-slate-400 font-medium">Time</p>

                    <div className="mt-2 flex items-center gap-2 text-white font-semibold">
                      <Clock size={15} className="text-cyan-400" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <p className="text-slate-400 font-medium">Location</p>

                    <div className="mt-2 flex items-center gap-2 text-white font-semibold truncate">
                      <MapPin size={15} className="text-cyan-400 shrink-0" />
                      <span className="truncate">
                        {appointment.doctor?.location || "Bhopal"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <p className="text-slate-400 font-medium">
                      Consultation Fee
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      ₹{appointment.consultationFee}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Reason for Visit
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-slate-300">
                      {appointment.reason}
                    </p>
                  </div>
                )}

                {["pending", "confirmed"].includes(appointment.status) && (
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-95 cursor-pointer"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
