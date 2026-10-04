import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Stethoscope,
  LayoutDashboard,
  Users,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
} from "lucide-react";

const ManagePatients = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Fetch Patients
  // =========================

  const fetchPatients = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/patients`,
        {
          params: {
            search: search.trim(),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setPatients(response.data.patients || []);
      }
    } catch (error) {
      console.error("FETCH PATIENTS ERROR:", error);

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

      toast.error(error.response?.data?.message || "Unable to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    fetchPatients();
  }, []);

  // =========================
  // Search
  // =========================

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // Toggle Patient Status
  // =========================

  const handleToggleStatus = async (patientId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(patientId);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/patients/${patientId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setPatients((prev) =>
          prev.map((patient) =>
            patient._id === patientId
              ? {
                  ...patient,
                  isActive: response.data.patient.isActive,
                }
              : patient,
          ),
        );
      }
    } catch (error) {
      console.error("TOGGLE PATIENT ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.error("Session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to update patient status",
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // Delete Patient
  // =========================

  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmDelete) return;

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(patientId);

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Patient deleted successfully");

        setPatients((prev) =>
          prev.filter((patient) => patient._id !== patientId),
        );
      }
    } catch (error) {
      console.error("DELETE PATIENT ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.error("Session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to delete patient");
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

    navigate("/user/login");
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
              Manage Patients
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Manage all registered patients
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-0 sm:p-2">
          {/* Search */}

          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/60"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md py-3 pl-11 pr-4 text-xs font-semibold text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/40 shadow-lg shadow-cyan-500/5"
              />
            </div>
          </div>

          {/* Patient Count */}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Total Patients
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                {patients.length}
              </p>
            </div>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-10 shadow-lg shadow-cyan-500/5">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-cyan-400" />

                <p className="text-xs text-gray-400 font-medium">
                  Loading patients...
                </p>
              </div>
            </div>
          ) : patients.length === 0 ? (
            /* Empty */

            <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md px-6 py-16 text-center shadow-lg shadow-cyan-500/5">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Users size={25} className="text-cyan-400" />
              </div>

              <h3 className="text-sm font-bold text-white">
                No patients found
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Try changing your search.
              </p>
            </div>
          ) : (
            /* Patient Grid */

            <div className="grid gap-5 xl:grid-cols-2">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 transition hover:border-cyan-500/30 shadow-lg shadow-cyan-500/5"
                >
                  {/* Card Header */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      {/* Avatar */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-500/20 bg-cyan-500/10 shadow-sm">
                        {patient.profileImage ? (
                          <img
                            src={patient.profileImage}
                            alt={patient.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={23} className="text-cyan-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-white">
                          {patient.name}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-gray-400">
                          Patient ID: {patient._id.slice(-8)}
                        </p>
                      </div>
                    </div>

                    {/* Status */}

                    <span
                      className={`
                        shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold border
                        ${
                          patient.isActive !== false
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      `}
                    >
                      {patient.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Details */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
                      <Mail size={16} className="shrink-0 text-cyan-400/70" />

                      <span className="truncate text-gray-300">
                        {patient.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
                      <Phone size={16} className="shrink-0 text-cyan-400/70" />

                      <span className="truncate text-gray-300">
                        {patient.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
                      <User size={16} className="shrink-0 text-cyan-400/70" />

                      <span className="capitalize text-gray-300">
                        {patient.gender || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
                      <MapPin size={16} className="shrink-0 text-cyan-400/70" />

                      <span className="truncate text-gray-300">
                        {patient.address || "Address not added"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex flex-col gap-3 border-t border-cyan-500/10 pt-5 sm:flex-row text-xs">
                    <button
                      onClick={() => handleToggleStatus(patient._id)}
                      disabled={actionLoading === patient._id}
                      className={`
                        flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 border cursor-pointer
                        ${
                          patient.isActive !== false
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        }
                      `}
                    >
                      {patient.isActive !== false ? (
                        <>
                          <UserX size={16} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} />
                          Activate
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(patient._id)}
                      disabled={actionLoading === patient._id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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

export default ManagePatients;
