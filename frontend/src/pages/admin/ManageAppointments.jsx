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

      const token = sessionStorage.getItem("token");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment/admin/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
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
    <div className="min-h-screen bg-[#07111f] text-white p-5 sm:p-8 mt-15">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Manage Appointments
            </h1>

            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              View and manage all patient appointments
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 font-medium transition hover:bg-cyan-500/20 shadow-sm"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Search + Filter */}
        <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-4 sm:p-5 mb-6 shadow-lg shadow-cyan-500/5">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/60"
                />

                <input
                  type="text"
                  placeholder="Search patient, doctor or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#07111f] border border-cyan-500/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-3 bg-cyan-500 text-gray-950 font-semibold rounded-xl hover:bg-cyan-400 transition shadow-md shadow-cyan-500/20"
              >
                Search
              </button>
            </form>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#07111f] border border-cyan-500/10 rounded-xl px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 md:w-52"
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
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">
              Total Appointments
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">
              {appointments.length}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          /* Empty */
          <div className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl py-20 text-center shadow-lg shadow-cyan-500/5">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <CalendarDays size={25} className="text-cyan-400" />
            </div>

            <h3 className="text-lg font-semibold">No appointments found</h3>

            <p className="text-gray-400 mt-2 text-sm">
              There are no appointments matching your search.
            </p>
          </div>
        ) : (
          /* Appointment Cards */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 hover:border-cyan-500/30 transition shadow-lg shadow-cyan-500/5"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Appointment ID</p>

                    <p className="text-sm text-gray-300 font-mono">
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
                  <div className="bg-[#07111f] border border-cyan-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-3">
                      <User size={18} />
                      <span className="text-sm font-medium">Patient</span>
                    </div>

                    <p className="font-semibold text-white">
                      {appointment.patient?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-400 mt-1 break-all">
                      {appointment.patient?.email || "N/A"}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {appointment.patient?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Doctor */}
                  <div className="bg-[#07111f] border border-cyan-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-400 mb-3">
                      <Stethoscope size={18} />
                      <span className="text-sm font-medium">Doctor</span>
                    </div>

                    <p className="font-semibold text-white">
                      {appointment.doctor?.name || "N/A"}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {appointment.doctor?.specialization || "N/A"}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {appointment.doctor?.qualification || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Date / Time / Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="flex items-center gap-3 bg-[#07111f] border border-cyan-500/10 rounded-xl p-3">
                    <CalendarDays
                      size={18}
                      className="text-purple-400 shrink-0"
                    />

                    <div>
                      <p className="text-xs text-gray-400">Date</p>

                      <p className="text-sm font-medium text-gray-200">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#07111f] border border-cyan-500/10 rounded-xl p-3">
                    <Clock size={18} className="text-amber-400 shrink-0" />

                    <div>
                      <p className="text-xs text-gray-400">Time</p>

                      <p className="text-sm font-medium text-gray-200">
                        {appointment.appointmentTime || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#07111f] border border-cyan-500/10 rounded-xl p-3">
                    <IndianRupee
                      size={18}
                      className="text-emerald-400 shrink-0"
                    />

                    <div>
                      <p className="text-xs text-gray-400">Fee</p>

                      <p className="text-sm font-medium text-gray-200">
                        ₹{appointment.consultationFee || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-[#07111f] border border-cyan-500/10 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Reason for Visit</p>

                  <p className="text-sm text-gray-300">
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
