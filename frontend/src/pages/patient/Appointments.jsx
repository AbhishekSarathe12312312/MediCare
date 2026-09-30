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
      const token = localStorage.getItem("token");

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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
      const token = localStorage.getItem("token");

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
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <p className="mb-2 text-sm font-medium text-cyan-400">MediCare</p>

          <h1 className="text-3xl font-bold md:text-4xl">My Appointments</h1>

          <p className="mt-2 text-slate-400">
            View and manage your upcoming and previous appointments.
          </p>
        </div>

        {/* Empty State */}
        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <CalendarDays size={48} className="mx-auto mb-5 text-slate-600" />

            <h2 className="text-xl font-semibold">No appointments yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't booked any appointments yet. Find a doctor and
              schedule your first appointment.
            </p>

            <button
              onClick={() => navigate("/patient/doctors")}
              className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  {/* Doctor */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-500/10 text-cyan-400">
                      {appointment.doctor?.profileImage ? (
                        <img
                          src={appointment.doctor.profileImage}
                          alt={appointment.doctor.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Stethoscope size={28} />
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        {appointment.doctor?.name || "Doctor"}
                      </h2>

                      <p className="mt-1 text-sm text-cyan-400">
                        {appointment.doctor?.specialization}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.doctor?.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-500">Date</p>

                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <CalendarDays size={17} className="text-cyan-400" />

                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Time</p>

                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Clock size={17} className="text-cyan-400" />

                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Location</p>

                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <MapPin size={17} className="text-cyan-400" />

                      <span>{appointment.doctor?.location || "Bhopal"}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Consultation Fee</p>

                    <p className="mt-2 text-sm font-semibold">
                      ₹{appointment.consultationFee}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Reason for Visit</p>

                    <p className="mt-1 text-sm text-slate-300">
                      {appointment.reason}
                    </p>
                  </div>
                )}
                {["pending", "confirmed"].includes(appointment.status) && (
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
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
