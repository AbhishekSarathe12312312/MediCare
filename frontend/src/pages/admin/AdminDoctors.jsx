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

const AdminDoctors = () => {
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
        `${import.meta.env.VITE_API_URL}/api/admin/doctors`,
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
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

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
    const token = sessionStorage.getItem("token");
    const storedAdmin = sessionStorage.getItem("user");

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

    const token = sessionStorage.getItem("token");

    if (token) {
      fetchDoctors(token, value);
    }
  };

  // =========================
  // Toggle Doctor Status
  // =========================

  const handleToggleStatus = async (doctor) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(doctor._id);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctor._id}/status`,
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

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(doctor._id);

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctor._id}`,
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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

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
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950 mt-15">
      {/* =========================
          Main Container (No Sidebar)
      ========================= */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Header / Top Navigation Bar */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-5 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Manage Doctors
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Manage all doctors in MediCare
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/doctor/register")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-teal-400 cursor-pointer"
            >
              <Plus size={16} className="text-gray-950 font-bold" />
              <span>Add Doctor</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-0 sm:p-2">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, email or specialization..."
                className="w-full rounded-xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md py-3 pl-11 pr-4 text-xs font-semibold text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/40 shadow-lg shadow-cyan-500/5"
              />
            </div>
          </div>

          {/* Doctor Count */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Doctors</h3>

              <p className="mt-0.5 text-xs text-gray-400">
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
            <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-10 text-center shadow-lg shadow-cyan-500/5">
              <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-gray-700 border-t-cyan-400" />

              <p className="text-xs text-gray-400 font-medium">
                Loading doctors...
              </p>
            </div>
          ) : doctors.length === 0 ? (
            /* =========================
                Empty
            ========================= */

            <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-12 text-center shadow-lg shadow-cyan-500/5">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <Stethoscope size={25} className="text-cyan-400" />
              </div>

              <h3 className="text-sm font-bold text-white">No doctors found</h3>

              <p className="mt-1 text-xs text-gray-400">
                {search
                  ? "Try a different search term."
                  : "No doctors have been added yet."}
              </p>

              {!search && (
                <button
                  onClick={() => navigate("/admin/create-doctor")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition cursor-pointer"
                >
                  <Plus size={16} />
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
                  className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 transition hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  {/* Top */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={doctor.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <Stethoscope size={22} className="text-cyan-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-white">
                          Dr. {doctor.name}
                        </h3>

                        <p className="mt-0.5 text-xs text-cyan-400 font-semibold">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    {/* Status */}

                    <span
                      className={`
                        shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold border
                        ${
                          doctor.isActive !== false
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      `}
                    >
                      {doctor.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Details */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail size={15} className="text-cyan-400/70 shrink-0" />
                      <span className="truncate">{doctor.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone size={15} className="text-cyan-400/70 shrink-0" />
                      <span>{doctor.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <BriefcaseMedical
                        size={15}
                        className="text-cyan-400/70 shrink-0"
                      />
                      <span>{doctor.qualification}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={15} className="text-cyan-400/70 shrink-0" />
                      <span>{doctor.location || "Bhopal"}</span>
                    </div>
                  </div>

                  {/* Stats */}

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
                      <p className="text-[11px] text-gray-400 font-medium">
                        Experience
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {doctor.experience} years
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
                      <p className="text-[11px] text-gray-400 font-medium">
                        Consultation Fee
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        ₹{doctor.consultationFee}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-cyan-500/10 pt-5 text-xs">
                    <button
                      onClick={() =>
                        navigate(`/admin/doctors/edit/${doctor._id}`)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/20 px-3 py-2.5 font-semibold text-gray-300 transition hover:bg-cyan-500/5 hover:text-cyan-300 cursor-pointer"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      disabled={actionLoading === doctor._id}
                      onClick={() => handleToggleStatus(doctor)}
                      className={`
                        flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 border cursor-pointer
                        ${
                          doctor.isActive !== false
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        }
                      `}
                    >
                      <Power size={15} />

                      {doctor.isActive !== false ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      disabled={actionLoading === doctor._id}
                      onClick={() => handleDeleteDoctor(doctor)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            MediCare Admin Portal &copy; 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDoctors;
