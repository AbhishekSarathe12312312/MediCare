import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Stethoscope,
  Users,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  Mail,
  Phone,
  MapPin,
  BriefcaseMedical,
  ShieldCheck,
} from "lucide-react";

const ManageDoctors = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [admin, setAdmin] = useState(null);

  // =========================
  // Fetch Doctors
  // =========================

  const fetchDoctors = async (token, searchValue = "") => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8000/api/doctor/admin/doctors",
        {
          params: {
            search: searchValue,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setDoctors(response.data.doctors || []);
      }
    } catch (error) {
      console.error("FETCH ADMIN DOCTORS ERROR:", error);

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

      toast.error(error.response?.data?.message || "Unable to load doctors");
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

    fetchDoctors(token);
  }, []);

  // =========================
  // Search
  // =========================

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    const token = localStorage.getItem("adminToken");

    if (token) {
      fetchDoctors(token, value);
    }
  };

  // =========================
  // Toggle Doctor Status
  // =========================

  const handleToggleStatus = async (doctor) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(doctor._id);

      const response = await axios.patch(
        `http://localhost:8000/api/doctor/admin/doctors/${doctor._id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        fetchDoctors(token, search);
      }
    } catch (error) {
      console.error("TOGGLE DOCTOR STATUS ERROR:", error);

      toast.error(
        error.response?.data?.message || "Unable to update doctor status",
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // Delete Doctor
  // =========================

  const handleDeleteDoctor = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Dr. ${doctor.name}?`,
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(doctor._id);

      const response = await axios.delete(
        `http://localhost:8000/api/doctor/admin/doctors/${doctor._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Doctor deleted successfully");

        setDoctors((prevDoctors) =>
          prevDoctors.filter((item) => item._id !== doctor._id),
        );
      }
    } catch (error) {
      console.error("DELETE DOCTOR ERROR:", error);

      toast.error(error.response?.data?.message || "Unable to delete doctor");
    } finally {
      setActionLoading("");
    }
  };

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

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Mobile Overlay */}

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
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              onClick={() => handleNavigation("/admin/doctors")}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-400"
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

        {/* Admin */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#07111f] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <ShieldCheck size={20} className="text-blue-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
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
          Main
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
              <h2 className="text-xl font-semibold sm:text-2xl">
                Manage Doctors
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage all doctors in MediCare
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/create-doctor")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Doctor</span>
          </button>
        </header>

        {/* Content */}

        <div className="p-5 sm:p-8">
          {/* Search */}

          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, email or specialization..."
                className="w-full rounded-xl border border-gray-800 bg-[#0b1728] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          {/* Doctor Count */}

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Doctors</h3>

              <p className="mt-1 text-sm text-gray-500">
                {loading
                  ? "Loading doctors..."
                  : `${doctors.length} doctor${
                      doctors.length !== 1 ? "s" : ""
                    } found`}
              </p>
            </div>
          </div>

          {/* =========================
              Loading
          ========================= */}

          {loading ? (
            <div className="rounded-2xl border border-gray-800 bg-[#0b1728] p-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-400" />

              <p className="text-sm text-gray-500">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            /* =========================
               Empty
            ========================= */

            <div className="rounded-2xl border border-gray-800 bg-[#0b1728] p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800">
                <Stethoscope size={25} className="text-gray-500" />
              </div>

              <h3 className="text-lg font-semibold">No doctors found</h3>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try a different search term."
                  : "No doctors have been added yet."}
              </p>

              {!search && (
                <button
                  onClick={() => navigate("/admin/create-doctor")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
                >
                  <Plus size={17} />
                  Add Doctor
                </button>
              )}
            </div>
          ) : (
            /* =========================
               Doctor Cards
            ========================= */

            <div className="grid gap-5 xl:grid-cols-2">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="rounded-2xl border border-gray-800 bg-[#0b1728] p-5 transition hover:border-gray-700"
                >
                  {/* Top */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/10">
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={doctor.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <Stethoscope size={24} className="text-blue-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold">
                          Dr. {doctor.name}
                        </h3>

                        <p className="mt-1 text-sm text-blue-400">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    {/* Status */}

                    <span
                      className={`
                        shrink-0 rounded-full px-3 py-1 text-xs font-medium
                        ${
                          doctor.isActive !== false
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }
                      `}
                    >
                      {doctor.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Details */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail size={16} className="text-gray-500" />
                      <span className="truncate">{doctor.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Phone size={16} className="text-gray-500" />
                      <span>{doctor.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BriefcaseMedical size={16} className="text-gray-500" />
                      <span>{doctor.qualification}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{doctor.location || "Bhopal"}</span>
                    </div>
                  </div>

                  {/* Stats */}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#07111f] p-3">
                      <p className="text-xs text-gray-500">Experience</p>

                      <p className="mt-1 text-sm font-semibold">
                        {doctor.experience} years
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#07111f] p-3">
                      <p className="text-xs text-gray-500">Consultation Fee</p>

                      <p className="mt-1 text-sm font-semibold">
                        ₹{doctor.consultationFee}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-800 pt-5">
                    <button
                      onClick={() =>
                        navigate(`/admin/doctors/edit/${doctor._id}`)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700 px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      disabled={actionLoading === doctor._id}
                      onClick={() => handleToggleStatus(doctor)}
                      className={`
                        flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50
                        ${
                          doctor.isActive !== false
                            ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }
                      `}
                    >
                      <Power size={16} />

                      {doctor.isActive !== false ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      disabled={actionLoading === doctor._id}
                      onClick={() => handleDeleteDoctor(doctor)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageDoctors;
