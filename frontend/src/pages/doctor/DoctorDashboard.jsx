import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Clock3,
  CheckCircle2,
  LogOut,
  Stethoscope,
  Menu,
  X,
  CircleUserRound,
} from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch doctor appointments
  useEffect(() => {
    const storedDoctor = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!token || !storedDoctor) {
      navigate("/login");
      return;
    }

    try {
      setDoctor(JSON.parse(storedDoctor));
    } catch (error) {
      console.error("DOCTOR DATA ERROR:", error);

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");

      navigate("/login");
      return;
    }

    fetchAppointments(token);
  }, [navigate]);

  // Get appointments from backend
  const fetchAppointments = async (token) => {
    try {
      setLoading(true);

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
      console.error("FETCH DOCTOR APPOINTMENTS ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

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
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // Appointment statistics
  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Today's appointments
  const todayAppointments = appointments.filter((appointment) => {
    if (!appointment.appointmentDate) {
      return false;
    }

    const appointmentDate = new Date(appointment.appointmentDate)
      .toISOString()
      .split("T")[0];

    return appointmentDate === today;
  });

  // Loading screen
  if (!doctor || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-800 border-t-cyan-400" />
          <p className="text-sm font-medium text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950 py-16">
      {/* Main Container (No Navbar, No Sidebar) */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Top Header Bar with Profile & Logout */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-sm">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRound size={28} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  {doctor.name}
                </h1>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
                  Active
                </span>
              </div>
              <p className="mt-0.5 text-xs text-cyan-400 font-medium">
                {doctor.specialization} &bull; {doctor.qualification}
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="mb-8 rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 md:p-8 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 mb-3 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Doctor Portal Active
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, Dr. {doctor.name}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Here is your appointment summary and patient queue for today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md transition hover:border-cyan-500/30 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">
                  Total Appointments
                </p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {totalAppointments}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md transition hover:border-amber-500/30 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">Pending</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {pendingAppointments}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Clock3 size={22} />
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md transition hover:border-emerald-500/30 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">Confirmed</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {confirmedAppointments}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md transition hover:border-purple-500/30 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400">Completed</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {completedAppointments}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="mt-8 rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md shadow-lg shadow-cyan-500/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyan-500/10 p-6">
            <div>
              <h2 className="text-base font-bold text-white">
                Today&apos;s Appointments
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Your appointments scheduled for today
              </p>
            </div>

            <button
              onClick={() => navigate("/doctor/appointments")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer transition"
            >
              View All &rarr;
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/10 bg-[#07111f] text-cyan-400">
                <CalendarDays size={24} />
              </div>

              <h3 className="text-sm font-bold text-white">
                No appointments today
              </h3>

              <p className="mt-1 max-w-sm text-xs text-gray-400">
                You don&apos;t have any appointments scheduled for today.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cyan-500/10">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between transition hover:bg-cyan-500/5"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {appointment.patient?.name || "Patient"}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <Clock3 size={13} className="text-cyan-400" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
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
              ))}
            </div>
          )}
        </div>

        {/* Doctor Information Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Professional Details */}
          <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <Stethoscope size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Professional Details
                </h2>
                <p className="text-xs text-gray-400">
                  Your medical profile overview
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between gap-4 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                <span className="text-gray-400 font-medium">
                  Specialization
                </span>
                <span className="font-semibold text-white text-right">
                  {doctor.specialization}
                </span>
              </div>

              <div className="flex justify-between gap-4 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                <span className="text-gray-400 font-medium">Qualification</span>
                <span className="font-semibold text-white text-right">
                  {doctor.qualification}
                </span>
              </div>

              <div className="flex justify-between gap-4 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                <span className="text-gray-400 font-medium">Experience</span>
                <span className="font-semibold text-white">
                  {doctor.experience} years
                </span>
              </div>

              <div className="flex justify-between gap-4 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                <span className="text-gray-400 font-medium">
                  Consultation Fee
                </span>
                <span className="font-semibold text-white">
                  ₹{doctor.consultationFee}
                </span>
              </div>

              <div className="flex justify-between gap-4 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                <span className="text-gray-400 font-medium">Location</span>
                <span className="font-semibold text-white truncate">
                  {doctor.location}
                </span>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">Account Status</h2>
                <p className="text-xs text-gray-400">
                  Current account verification info
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Account Active
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-400">
                Your MediCare doctor account is fully active and available for
                managing patient consultations and appointments.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            MediCare Doctor Portal &copy; 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
