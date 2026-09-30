import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment/admin/appointments`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          params: {
            search,
            status,
          },
        },
      );

      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("GET ADMIN APPOINTMENTS ERROR:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (appointmentStatus) => {
    switch (appointmentStatus) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "confirmed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Appointments</h1>

            <p className="text-slate-400 mt-1">
              View and manage all patient appointments
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Search + Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Search patient, doctor or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Search
              </button>
            </form>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 md:w-52"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Appointment Count */}
        <div className="mb-5 text-slate-400">
          Total Appointments:{" "}
          <span className="text-white font-semibold">
            {appointments.length}
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          /* Empty */
          <div className="bg-slate-900 border border-slate-800 rounded-xl py-20 text-center">
            <CalendarDays size={48} className="mx-auto text-slate-600 mb-4" />

            <h2 className="text-xl font-semibold">No appointments found</h2>

            <p className="text-slate-500 mt-2">
              There are no appointments matching your search.
            </p>
          </div>
        ) : (
          /* Appointment Cards */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Appointment ID
                    </p>

                    <p className="text-sm text-slate-300 font-mono">
                      {appointment._id}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize ${getStatusStyle(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Patient + Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {/* Patient */}
                  <div className="bg-slate-950 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-3">
                      <User size={18} />
                      <span className="text-sm font-medium">Patient</span>
                    </div>

                    <p className="font-semibold">
                      {appointment.patient?.name || "N/A"}
                    </p>

                    <p className="text-sm text-slate-400 mt-1 break-all">
                      {appointment.patient?.email || "N/A"}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      {appointment.patient?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Doctor */}
                  <div className="bg-slate-950 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-3">
                      <Stethoscope size={18} />
                      <span className="text-sm font-medium">Doctor</span>
                    </div>

                    <p className="font-semibold">
                      {appointment.doctor?.name || "N/A"}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      {appointment.doctor?.specialization || "N/A"}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      {appointment.doctor?.qualification || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Date / Time / Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-3">
                    <CalendarDays size={18} className="text-purple-400" />

                    <div>
                      <p className="text-xs text-slate-500">Date</p>

                      <p className="text-sm font-medium">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-3">
                    <Clock size={18} className="text-orange-400" />

                    <div>
                      <p className="text-xs text-slate-500">Time</p>

                      <p className="text-sm font-medium">
                        {appointment.appointmentTime || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-3">
                    <IndianRupee size={18} className="text-emerald-400" />

                    <div>
                      <p className="text-xs text-slate-500">Fee</p>

                      <p className="text-sm font-medium">
                        ₹{appointment.consultationFee || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Reason for Visit
                  </p>

                  <p className="text-sm text-slate-300">
                    {appointment.reason || "No reason provided"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;
