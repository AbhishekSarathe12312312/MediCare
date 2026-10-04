import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Search,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Loader2,
} from "lucide-react";

const DoctorPatients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPatients = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "null");

      if (!token || !user || user.role !== "doctor") {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/doctor/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setPatients(response.data.patients || []);
      }
    } catch (error) {
      console.error("GET DOCTOR PATIENTS ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load patients");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredPatients = patients.filter((patient) => {
    const searchText = search.toLowerCase().trim();

    return (
      patient.name?.toLowerCase().includes(searchText) ||
      patient.email?.toLowerCase().includes(searchText) ||
      patient.phone?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8 lg:px-12 pt-16 selection:bg-cyan-500 selection:text-slate-950 mt-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="group mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition hover:border-cyan-500/40 hover:text-white cursor-pointer shadow-sm"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to Dashboard
            </button>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-sm ml-2 sm:ml-0">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              MediCare Doctor Portal
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              My Patients
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              View and manage your patient records and medical consultation
              history.
            </p>
          </div>

          {/* Patient Count */}
          <div className="flex w-fit items-center gap-3.5 rounded-3xl border border-slate-800/80 bg-slate-900/60 px-5 py-3.5 backdrop-blur-xl shadow-xl shadow-slate-950/30">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <Users size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Total Patients
              </p>
              <p className="text-xl font-bold tracking-tight text-white">
                {patients.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patients by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/60 py-4 pl-11 pr-4 text-xs font-medium text-white backdrop-blur-xl outline-none placeholder:text-slate-500 transition-all focus:border-cyan-500/50 focus:bg-slate-900 focus:shadow-lg focus:shadow-slate-950/40"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl py-20 text-center shadow-xl shadow-slate-950/30">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-cyan-400 mb-3"
            />
            <p className="text-xs font-medium text-slate-400">
              Loading patients...
            </p>
          </div>
        ) : filteredPatients.length === 0 ? (
          /* Empty */
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-5 py-20 text-center shadow-xl shadow-slate-950/30">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-500 shadow-inner">
              <Users size={28} />
            </div>

            <h2 className="text-base font-bold text-white">
              {search ? "No patients found" : "No patients yet"}
            </h2>

            <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
              {search
                ? "Try searching with a different name, email or phone number."
                : "Patients who book appointments with you will appear here."}
            </p>
          </div>
        ) : (
          /* Patient List */
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-slate-950/40"
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div className="flex items-center gap-4">
                    {patient.profileImage ? (
                      <img
                        src={patient.profileImage}
                        alt={patient.name}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover border border-cyan-500/30 shadow-inner"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
                        <UserRound size={24} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold text-white">
                        {patient.name || "Patient"}
                      </h2>

                      <p className="mt-0.5 truncate text-xs font-semibold text-cyan-400 capitalize">
                        {patient.gender || "Gender not provided"}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 shadow-sm">
                    {patient.totalAppointments || 0}{" "}
                    {patient.totalAppointments === 1
                      ? "Appointment"
                      : "Appointments"}
                  </span>
                </div>

                {/* Patient Details */}
                <div className="space-y-3.5 py-5 text-xs">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <Mail size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-400 font-medium">Email</p>
                      <p className="mt-0.5 truncate font-semibold text-white">
                        {patient.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <Phone size={15} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Phone</p>
                      <p className="mt-0.5 font-semibold text-white">
                        {patient.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                      <CalendarDays size={15} />
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">
                        Date of Birth
                      </p>
                      <p className="mt-0.5 font-semibold text-white">
                        {formatDate(patient.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Appointment */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs">
                  <p className="font-medium text-slate-400">Last Appointment</p>
                  <p className="mt-1 font-semibold text-cyan-400">
                    {formatDate(patient.lastAppointmentDate)}
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

export default DoctorPatients;
