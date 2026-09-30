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
    const adminToken =
      localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8000/api/user/admin/patients",
        {
          params: {
            search: search.trim(),
          },
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        setPatients(
          response.data.patients || []
        );
      }
    } catch (error) {
      console.error(
        "FETCH PATIENTS ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        toast.error(
          "Session expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        navigate("/admin/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch patients"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    const storedAdmin =
      localStorage.getItem("admin");

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

  const handleToggleStatus = async (
    patientId
  ) => {
    const adminToken =
      localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(patientId);

      const response = await axios.patch(
        `http://localhost:8000/api/user/admin/patients/${patientId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message
        );

        setPatients((prev) =>
          prev.map((patient) =>
            patient._id === patientId
              ? {
                  ...patient,
                  isActive:
                    response.data.patient
                      .isActive,
                }
              : patient
          )
        );
      }
    } catch (error) {
      console.error(
        "TOGGLE PATIENT ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        toast.error(
          "Session expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to update patient status"
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // Delete Patient
  // =========================

  const handleDelete = async (
    patientId
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    const adminToken =
      localStorage.getItem("adminToken");

    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    try {
      setActionLoading(patientId);

      const response = await axios.delete(
        `http://localhost:8000/api/user/admin/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Patient deleted successfully"
        );

        setPatients((prev) =>
          prev.filter(
            (patient) =>
              patient._id !== patientId
          )
        );
      }
    } catch (error) {
      console.error(
        "DELETE PATIENT ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        toast.error(
          "Session expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to delete patient"
      );
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
          onClick={() =>
            setSidebarOpen(false)
          }
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
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-gray-800 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <Stethoscope
                size={23}
                className="text-blue-400"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Medi
                <span className="text-blue-400">
                  Care
                </span>
              </h1>

              <p className="text-[11px] text-gray-500">
                Admin Panel
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
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
              onClick={() =>
                handleNavigation(
                  "/admin/dashboard"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/admin/doctors"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <Stethoscope size={19} />
              Doctors
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/admin/patients"
                )
              }
              className="flex w-full items-center gap-3 rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-400"
            >
              <Users size={19} />
              Patients
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/admin/appointments"
                )
              }
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
              <ShieldCheck
                size={20}
                className="text-blue-400"
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-medium">
                {admin?.name || "Admin"}
              </p>

              <p className="truncate text-xs text-gray-500">
                {admin?.email ||
                  "admin@medicare.com"}
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

        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-gray-800 bg-[#07111f]/95 px-5 py-4 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="text-gray-300 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">
                Manage Patients
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Manage all registered patients
              </p>
            </div>

          </div>

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
                placeholder="Search by name, email or phone..."
                className="w-full rounded-xl border border-gray-800 bg-[#0b1728] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />

            </div>

          </div>

          {/* Patient Count */}

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Patients
              </p>

              <p className="mt-1 text-2xl font-bold">
                {patients.length}
              </p>
            </div>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-gray-700 border-t-blue-400" />

                <p className="text-sm text-gray-500">
                  Loading patients...
                </p>

              </div>

            </div>
          ) : patients.length === 0 ? (
            /* Empty */

            <div className="rounded-2xl border border-gray-800 bg-[#0b1728] px-6 py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800">

                <Users
                  size={25}
                  className="text-gray-500"
                />

              </div>

              <h3 className="text-lg font-semibold">
                No patients found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search.
              </p>

            </div>
          ) : (
            /* Patient Grid */

            <div className="grid gap-5 xl:grid-cols-2">

              {patients.map((patient) => (

                <div
                  key={patient._id}
                  className="rounded-2xl border border-gray-800 bg-[#0b1728] p-5 transition hover:border-gray-700"
                >

                  {/* Card Header */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-4">

                      {/* Avatar */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-500/10">

                        {patient.profileImage ? (
                          <img
                            src={
                              patient.profileImage
                            }
                            alt={patient.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User
                            size={25}
                            className="text-blue-400"
                          />
                        )}

                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-lg font-semibold">
                          {patient.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Patient ID:{" "}
                          {patient._id.slice(-8)}
                        </p>

                      </div>

                    </div>

                    {/* Status */}

                    <span
                      className={`
                        shrink-0 rounded-full px-3 py-1 text-xs font-medium
                        ${
                          patient.isActive !==
                          false
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }
                      `}
                    >
                      {patient.isActive !==
                      false
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] p-3">

                      <Mail
                        size={17}
                        className="shrink-0 text-gray-500"
                      />

                      <span className="truncate text-sm text-gray-300">
                        {patient.email}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] p-3">

                      <Phone
                        size={17}
                        className="shrink-0 text-gray-500"
                      />

                      <span className="truncate text-sm text-gray-300">
                        {patient.phone}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] p-3">

                      <User
                        size={17}
                        className="shrink-0 text-gray-500"
                      />

                      <span className="text-sm capitalize text-gray-300">
                        {patient.gender ||
                          "Not specified"}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#07111f] p-3">

                      <MapPin
                        size={17}
                        className="shrink-0 text-gray-500"
                      />

                      <span className="truncate text-sm text-gray-300">
                        {patient.address ||
                          "Address not added"}
                      </span>

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex flex-col gap-3 border-t border-gray-800 pt-5 sm:flex-row">

                    <button
                      onClick={() =>
                        handleToggleStatus(
                          patient._id
                        )
                      }
                      disabled={
                        actionLoading ===
                        patient._id
                      }
                      className={`
                        flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50
                        ${
                          patient.isActive !==
                          false
                            ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }
                      `}
                    >

                      {patient.isActive !==
                      false ? (
                        <>
                          <UserX size={17} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck size={17} />
                          Activate
                        </>
                      )}

                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          patient._id
                        )
                      }
                      disabled={
                        actionLoading ===
                        patient._id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} />
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

export default ManagePatients;