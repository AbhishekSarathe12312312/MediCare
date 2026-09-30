import {
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  HeartPulse,
  LogOut,
  Menu,
  Pill,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Patient",
  };

  // Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      // Backend logout fail ho jaye tab bhi
      // frontend authentication clear kar do
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  // Sidebar navigation
  const menuItems = [
    {
      name: "Dashboard",
      icon: HeartPulse,
      active: true,
    },
    {
      name: "Find Doctors",
      icon: Stethoscope,
      onClick: () => navigate("/patient/doctors"),
    },
    {
      name: "Appointments",
      icon: CalendarDays,
      onClick: () => navigate("/patient/appointments")
    },
    {
      name: "Prescriptions",
      icon: Pill,
    },
    {
      name: "Medical Records",
      icon: FileText,
    },
    {
      name: "My Profile",
      icon: UserRound,
      onClick: () => navigate("/patient/profile"),
    },
  ];

  // Dashboard stats
  const stats = [
    {
      title: "Upcoming Appointments",
      value: "2",
      icon: CalendarDays,
      description: "Next 30 days",
    },
    {
      title: "Total Appointments",
      value: "8",
      icon: Clock3,
      description: "All time",
    },
    {
      title: "Prescriptions",
      value: "4",
      icon: Pill,
      description: "Active prescriptions",
    },
    {
      title: "Medical Records",
      value: "6",
      icon: FileText,
      description: "Available records",
    },
  ];

  // Temporary dummy appointments
  const upcomingAppointments = [
    {
      doctor: "Dr. Rahul Sharma",
      specialty: "Cardiologist",
      date: "05 Oct 2026",
      time: "10:30 AM",
    },
    {
      doctor: "Dr. Priya Verma",
      specialty: "General Physician",
      date: "12 Oct 2026",
      time: "04:00 PM",
    },
  ];

  // Quick action handlers
  const handleFindDoctor = () => {
    navigate("/patient/doctors");
  };

  const handleBookAppointment = () => {
    navigate("/patient/doctors");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-800 bg-slate-900 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <HeartPulse className="h-6 w-6 text-cyan-400" />
              </div>

              <div>
                <h1 className="text-xl font-bold">MediCare</h1>

                <p className="text-xs text-slate-400">Patient Portal</p>
              </div>
            </div>

            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* User */}
          <div className="border-b border-slate-800 px-5 py-5">
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/10">
                <UserRound className="h-5 w-5 text-cyan-400" />
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>

                <p className="text-xs text-slate-400">Patient</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    item.active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />

              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-slate-400">Patient Dashboard</p>

              <h2 className="text-xl font-semibold">
                Welcome back, {user.name}
              </h2>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user.name}</p>

                <p className="text-xs text-slate-500">Patient</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800">
                <UserRound className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Welcome Card */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-6 sm:p-8">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-cyan-400">
                <HeartPulse className="h-5 w-5" />

                <span className="text-sm font-medium">
                  Your Health, Our Priority
                </span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Good to see you, {user.name} 👋
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Manage your appointments, prescriptions and medical records from
                one secure place.
              </p>

              <button
                onClick={handleFindDoctor}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Find a Doctor
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.title}</p>

                      <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Appointments + Quick Actions */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Upcoming Appointments */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
                <div>
                  <h2 className="font-semibold">Upcoming Appointments</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your scheduled appointments
                  </p>
                </div>

                <button
                  onClick={() => console.log("Appointments page")}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-slate-800">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={`${appointment.doctor}-${appointment.date}`}
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                        <Stethoscope className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="font-medium">{appointment.doctor}</h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {appointment.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-medium">{appointment.date}</p>

                      <p className="mt-1 text-sm text-cyan-400">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 px-5 py-5">
                <h2 className="font-semibold">Quick Actions</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Frequently used services
                </p>
              </div>

              <div className="space-y-3 p-5">
                {/* Book Appointment */}
                <button
                  onClick={handleBookAppointment}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-cyan-500/30 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-cyan-400" />

                    <span className="text-sm">Book Appointment</span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>

                {/* Find Doctor */}
                <button
                  onClick={handleFindDoctor}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-cyan-500/30 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-cyan-400" />

                    <span className="text-sm">Find a Doctor</span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>

                {/* Medical Records */}
                <button
                  onClick={() => console.log("Medical Records")}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-cyan-500/30 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-cyan-400" />

                    <span className="text-sm">Medical Records</span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>

                {/* Prescriptions */}
                <button
                  onClick={() => console.log("Prescriptions")}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-cyan-500/30 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-cyan-400" />

                    <span className="text-sm">Prescriptions</span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
