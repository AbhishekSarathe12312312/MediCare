import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
} from "lucide-react";

const DoctorAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "null");

      if (!token || !user || user.role !== "doctor") {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment/doctor-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      }
    } catch (error) {
      console.error("GET DOCTOR APPOINTMENTS ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to load appointments",
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (appointmentId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "null");

      if (!token || !user || user.role !== "doctor") {
        navigate("/login");
        return;
      }

      setUpdatingId(appointmentId);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/appointment/update-status/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Appointment updated");
        await fetchAppointments();
      }
    } catch (error) {
      console.error("UPDATE APPOINTMENT ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to update appointment",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-400";

      case "completed":
        return "bg-blue-500/10 text-blue-400";

      case "cancelled":
        return "bg-red-500/10 text-red-400";

      default:
        return "bg-amber-500/10 text-amber-400";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 text-slate-100 md:px-8 lg:px-12 pt-26 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="group mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:border-cyan-500/40 hover:text-white cursor-pointer shadow-sm"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Dashboard
          </button>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-sm ml-2 sm:ml-0">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            MediCare Doctor Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            View and manage your incoming patient appointment requests.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl py-20 text-center shadow-xl shadow-slate-950/30">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400" />
            <p className="text-xs font-medium text-slate-400">
              Loading appointments...
            </p>
          </div>
        ) : appointments.length === 0 ? (
          /* Empty */
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-5 py-20 text-center shadow-xl shadow-slate-950/30">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-500 shadow-inner">
              <CalendarDays size={28} />
            </div>

            <h2 className="text-base font-bold text-white">
              No appointments found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
              Patient appointments will appear here when someone books a
              consultation with you.
            </p>
          </div>
        ) : (
          /* Appointment List */
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-slate-950/40"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-white">
                        {appointment.patient?.name || "Patient"}
                      </h2>

                      <p className="mt-0.5 text-xs font-semibold text-cyan-400">
                        Patient
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                      appointment.status === "pending"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : appointment.status === "confirmed"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : appointment.status === "completed"
                            ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <CalendarDays size={15} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Date</p>
                      <p className="mt-0.5 font-semibold text-white">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <Clock3 size={15} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Time</p>
                      <p className="mt-0.5 font-semibold text-white">
                        {appointment.appointmentTime || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <Phone size={15} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Phone</p>
                      <p className="mt-0.5 font-semibold text-white">
                        {appointment.patient?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <Mail size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-400 font-medium">Email</p>
                      <p className="mt-0.5 font-semibold text-white truncate">
                        {appointment.patient?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs">
                    <div className="flex items-start gap-3">
                      <ClipboardCheck
                        size={16}
                        className="mt-0.5 text-cyan-400 shrink-0"
                      />
                      <div>
                        <p className="font-medium text-slate-400">
                          Reason for Visit
                        </p>
                        <p className="mt-1 leading-relaxed text-slate-300">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {appointment.status === "pending" && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-800/80 pt-5 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => updateStatus(appointment._id, "cancelled")}
                      disabled={updatingId === appointment._id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <XCircle size={15} />
                      Cancel
                    </button>

                    <button
                      onClick={() => updateStatus(appointment._id, "confirmed")}
                      disabled={updatingId === appointment._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      Confirm Appointment
                    </button>
                  </div>
                )}

                {/* Complete */}
                {appointment.status === "confirmed" && (
                  <div className="mt-5 flex justify-end border-t border-slate-800/80 pt-5">
                    <button
                      onClick={() => updateStatus(appointment._id, "completed")}
                      disabled={updatingId === appointment._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      Mark Completed
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

export default DoctorAppointments;
