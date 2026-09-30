import { useEffect, useState } from "react";
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

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/appointment/doctor-appointments",
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
      console.error("GET DOCTOR APPOINTMENTS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");
        navigate("/doctor/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);

      const token = localStorage.getItem("doctorToken");

      const response = await axios.put(
        `http://localhost:8000/api/appointment/update-status/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAppointments();
      }
    } catch (error) {
      console.error("UPDATE APPOINTMENT ERROR:", error);

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
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your patient appointments
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 py-20 text-center">
            <p className="text-sm text-slate-500">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          /* Empty */
          <div className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
              <CalendarDays size={28} className="text-slate-500" />
            </div>

            <h2 className="text-lg font-semibold">No appointments found</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Patient appointments will appear here when someone books an
              appointment with you.
            </p>
          </div>
        ) : (
          /* Appointment List */
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                      <UserRound size={23} className="text-blue-400" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">
                        {appointment.patient?.name || "Patient"}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">Patient</p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid gap-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={19} className="text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">Date</p>

                      <p className="mt-1 text-sm text-slate-300">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock3 size={19} className="text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">Time</p>

                      <p className="mt-1 text-sm text-slate-300">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={19} className="text-slate-500" />

                    <div>
                      <p className="text-xs text-slate-500">Phone</p>

                      <p className="mt-1 text-sm text-slate-300">
                        {appointment.patient?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={19} className="text-slate-500" />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Email</p>

                      <p className="mt-1 truncate text-sm text-slate-300">
                        {appointment.patient?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-start gap-3">
                      <ClipboardCheck
                        size={19}
                        className="mt-0.5 text-slate-500"
                      />

                      <div>
                        <p className="text-xs text-slate-500">
                          Reason for Visit
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {appointment.status === "pending" && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => updateStatus(appointment._id, "cancelled")}
                      disabled={updatingId === appointment._id}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Cancel
                    </button>

                    <button
                      onClick={() => updateStatus(appointment._id, "confirmed")}
                      disabled={updatingId === appointment._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                    >
                      <CheckCircle2 size={17} />
                      Confirm Appointment
                    </button>
                  </div>
                )}

                {/* Complete */}
                {appointment.status === "confirmed" && (
                  <div className="mt-5 flex justify-end border-t border-slate-800 pt-5">
                    <button
                      onClick={() => updateStatus(appointment._id, "completed")}
                      disabled={updatingId === appointment._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
                    >
                      <CheckCircle2 size={17} />
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
