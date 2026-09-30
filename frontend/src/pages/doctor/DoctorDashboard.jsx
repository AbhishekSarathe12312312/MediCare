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
    const storedDoctor = localStorage.getItem("doctor");
    const token = localStorage.getItem("doctorToken");

    if (!token || !storedDoctor) {
      navigate("/doctor/login");
      return;
    }

    try {
      setDoctor(JSON.parse(storedDoctor));
    } catch (error) {
      console.error("DOCTOR DATA ERROR:", error);

      localStorage.removeItem("doctor");
      localStorage.removeItem("doctorToken");

      navigate("/doctor/login");
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
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        toast.error("Session expired. Please login again.");

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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    toast.success("Logged out successfully");

    navigate("/doctor/login");
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Stethoscope size={21} />
            </div>

            <div>
              <h1 className="font-bold text-white">MediCare</h1>

              <p className="text-xs text-slate-500">Doctor Portal</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-600/20">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRound size={28} className="text-blue-400" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                {doctor.name}
              </h2>

              <p className="truncate text-xs text-slate-500">
                {doctor.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          <button
            onClick={() => {
              navigate("/doctor/dashboard");
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl bg-blue-600/10 px-4 py-3 text-sm font-medium text-blue-400"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/doctor/appointments");
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <CalendarDays size={19} />
            Appointments
          </button>

          <button
            onClick={() => {
              navigate("/doctor/profile");
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <UserRound size={19} />
            My Profile
          </button>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">Doctor Dashboard</h2>

              <p className="hidden text-sm text-slate-500 sm:block">
                Welcome back, {doctor.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/doctor/profile")}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 transition hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20">
              <UserRound size={17} className="text-blue-400" />
            </div>

            <span className="hidden text-sm font-medium text-slate-300 sm:block">
              Profile
            </span>
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <div className="mb-8 rounded-3xl border border-blue-500/10 bg-gradient-to-r from-blue-600/10 to-slate-900 p-6">
            <p className="mb-2 text-sm font-medium text-blue-400">
              Welcome back 👋
            </p>

            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {doctor.name}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {doctor.specialization} • {doctor.qualification}
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Appointments</p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {totalAppointments}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <CalendarDays size={22} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending</p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {pendingAppointments}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                  <Clock3 size={22} className="text-amber-400" />
                </div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Confirmed</p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {confirmedAppointments}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed</p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {completedAppointments}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                  <CheckCircle2 size={22} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Today&apos;s Appointments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your appointments scheduled for today
                </p>
              </div>

              <button
                onClick={() => navigate("/doctor/appointments")}
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                View All
              </button>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
                  <CalendarDays size={25} className="text-slate-500" />
                </div>

                <h3 className="font-medium text-white">
                  No appointments today
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  You don&apos;t have any appointments scheduled for today.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-white">
                        {appointment.patient?.name || "Patient"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.appointmentTime}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        appointment.status === "pending"
                          ? "bg-amber-500/10 text-amber-400"
                          : appointment.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : appointment.status === "completed"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Doctor Information */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* Professional Details */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Stethoscope size={20} className="text-blue-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Professional Details
                  </h2>

                  <p className="text-xs text-slate-500">Your medical profile</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">Specialization</span>

                  <span className="text-right text-sm text-slate-300">
                    {doctor.specialization}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">Qualification</span>

                  <span className="text-right text-sm text-slate-300">
                    {doctor.qualification}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">Experience</span>

                  <span className="text-sm text-slate-300">
                    {doctor.experience} years
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Consultation Fee
                  </span>

                  <span className="text-sm text-slate-300">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500">Location</span>

                  <span className="text-sm text-slate-300">
                    {doctor.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">Account Status</h2>

                  <p className="text-xs text-slate-500">
                    Current account information
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />

                  <span className="text-sm font-medium text-emerald-400">
                    Account Active
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Your MediCare doctor account is active and available for
                  managing appointments.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-8 text-center">
            <p className="text-xs text-slate-600">MediCare Doctor Portal</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
