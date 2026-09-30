import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  LogOut,
  Menu,
  X,
  Clock3,
  CheckCircle2,
  CircleX,
  Activity,
  ShieldCheck,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Fetch Admin Dashboard
  // =========================

  const fetchDashboard = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("FETCH ADMIN DASHBOARD ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        toast.error("Session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        navigate("/admin/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    fetchDashboard(token);
  }, []);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    toast.success("Logged out successfully");

    navigate("/admin/login");
  };

  // =========================
  // Navigation
  // =========================

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  // =========================
  // Stats
  // =========================

  const statCards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      description: "Registered doctors",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      description: "Registered patients",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      description: "All appointments",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock3,
      description: "Waiting for action",
    },
  ];

  const appointmentStats = [
    {
      title: "Pending",
      value: stats.pendingAppointments,
      icon: Clock3,
    },
    {
      title: "Confirmed",
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      icon: Activity,
    },
    {
      title: "Cancelled",
      value: stats.cancelledAppointments,
      icon: CircleX,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* =========================
          Mobile Overlay
      ========================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72
          border-r border-gray-800
          bg-[#0b1728]
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-gray-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Stethoscope size={23} className="text-blue-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Medi
                <span className="text-blue-400">Care</span>
              </h1>

              <p className="text-[11px] text-gray-500">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main Menu
          </p>

          <nav className="space-y-1">
            <button
              onClick={() => handleNavigation("/admin/dashboard")}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-400"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              onClick={() => handleNavigation("/admin/doctors")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <Stethoscope size={19} />
              Doctors
            </button>

            <button
              onClick={() => handleNavigation("/admin/patients")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <Users size={19} />
              Patients
            </button>

            <button
              onClick={() => handleNavigation("/admin/appointments")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <CalendarDays size={19} />
              Appointments
            </button>
          </nav>
        </div>

        {/* Admin Profile */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#07111f] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <ShieldCheck size={20} className="text-blue-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {admin?.name || "Admin"}
              </p>

              <p className="truncate text-xs text-gray-500">
                {admin?.email || "admin@medicare.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* =========================
          Main Content
      ========================= */}

      <main className="lg:ml-72">
        {/* Header */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-800 bg-[#07111f]/95 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-300 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">Dashboard</h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage your MediCare system
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <ShieldCheck size={19} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-medium">{admin?.name || "Admin"}</p>

              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </header>

        {/* Content */}

        <div className="p-5 sm:p-8">
          {/* Welcome */}

          <div className="mb-8">
            <h3 className="text-2xl font-bold">
              Welcome back,{" "}
              <span className="text-blue-400">
                {admin?.name?.split(" ")[0] || "Admin"}
              </span>
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening in your hospital today.
            </p>
          </div>

          {/* =========================
              Main Stats
          ========================= */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-800 bg-[#0b1728] p-5 transition hover:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{card.title}</p>

                      <p className="mt-3 text-3xl font-bold">
                        {loading ? "—" : card.value}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                      <Icon size={21} className="text-blue-400" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-600">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* =========================
              Appointment Overview
          ========================= */}

          <div className="mt-8">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Appointment Overview</h3>

              <p className="mt-1 text-sm text-gray-500">
                Current appointment status
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {appointmentStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-[#0b1728] p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-800/70">
                      <Icon size={21} className="text-gray-300" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>

                      <p className="mt-1 text-2xl font-bold">
                        {loading ? "—" : item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================
              Quick Actions
          ========================= */}

          <div className="mt-8">
            <h3 className="mb-5 text-lg font-semibold">Quick Actions</h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => navigate("/admin/doctors")}
                className="group rounded-2xl border border-gray-800 bg-[#0b1728] p-5 text-left transition hover:border-blue-500/30 hover:bg-[#0e1c30]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Stethoscope size={21} className="text-blue-400" />
                </div>

                <h4 className="font-semibold">Manage Doctors</h4>

                <p className="mt-1 text-sm text-gray-500">
                  Create, edit and manage doctors
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/patients")}
                className="group rounded-2xl border border-gray-800 bg-[#0b1728] p-5 text-left transition hover:border-blue-500/30 hover:bg-[#0e1c30]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Users size={21} className="text-blue-400" />
                </div>

                <h4 className="font-semibold">Manage Patients</h4>

                <p className="mt-1 text-sm text-gray-500">
                  View and manage patient accounts
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/appointments")}
                className="group rounded-2xl border border-gray-800 bg-[#0b1728] p-5 text-left transition hover:border-blue-500/30 hover:bg-[#0e1c30]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <CalendarDays size={21} className="text-blue-400" />
                </div>

                <h4 className="font-semibold">Manage Appointments</h4>

                <p className="mt-1 text-sm text-gray-500">
                  Monitor all appointments
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
