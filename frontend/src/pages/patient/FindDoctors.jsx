import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Stethoscope,
  MapPin,
  Star,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const specializations = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
];

const FindDoctors = () => {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctor/get-doctors`,
        );

        if (response.data.success) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error("GET DOCTORS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Search + specialization filter
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(search.toLowerCase());

      const matchesSpecialization =
        specialization === "All" || doctor.specialization === specialization;

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, search, specialization]);

  const handleBookAppointment = (doctor) => {
    navigate(`/patient/book-appointment/${doctor._id}`);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

          <p className="text-sm text-slate-400">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8 lg:px-12 pt-16 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            MediCare Specialists
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Find a Doctor</h1>

          <p className="mt-1 text-sm text-slate-400">
            Discover and connect with top-rated medical specialists and book appointments seamlessly.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/70"
              />

              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Specialization */}
            <div className="relative lg:w-72">
              <SlidersHorizontal
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/70"
              />

              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-10 text-sm text-white outline-none transition focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
              >
                {specializations.map((item) => (
                  <option key={item} value={item} className="bg-slate-950 text-white">
                    {item}
                  </option>
                ))}
              </select>
              
              {/* Custom select arrow indicator */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Result Count */}
        <div className="mb-5 flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-white">Available Doctors</h2>

          <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
          </span>
        </div>

        {/* No Doctors */}
        {filteredDoctors.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl py-16 text-center shadow-xl shadow-slate-950/30">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-500">
              <Stethoscope size={28} />
            </div>

            <h3 className="text-lg font-semibold text-white">No doctors found</h3>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search terms or specialization filters.
            </p>
          </div>
        ) : (
          /* Doctors Grid */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-cyan-950/20"
              >
                <div>
                  {/* Doctor Top */}
                  <div className="flex items-start gap-4">
                    {/* Doctor Image / Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
                      {doctor.profileImage ? (
                        <img
                          src={doctor.profileImage}
                          alt={doctor.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Stethoscope size={26} />
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {doctor.name}
                      </h3>

                      <p className="mt-0.5 text-xs font-semibold text-cyan-400">
                        {doctor.specialization}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="font-medium">{doctor.rating || "New"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="mt-5 space-y-3 border-t border-slate-800/80 pt-4 text-xs">
                    {/* Experience */}
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                        <CalendarDays size={14} />
                      </div>
                      <span><strong className="text-white">{doctor.experience} Years</strong> of experience</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                        <MapPin size={14} />
                      </div>
                      <span>{doctor.location || "Bhopal"}</span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            doctor.available ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                          }`}
                        />
                      </div>
                      <span
                        className={
                          doctor.available ? "font-medium text-emerald-400" : "font-medium text-red-400"
                        }
                      >
                        {doctor.available
                          ? "Available for appointment"
                          : "Currently unavailable"}
                      </span>
                    </div>

                    {/* Consultation Fee */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 px-3.5 py-2.5 mt-4">
                      <span className="text-slate-400">
                        Consultation Fee
                      </span>

                      <span className="text-sm font-bold text-white">
                        ₹{doctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book Appointment */}
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  disabled={!doctor.available}
                  className={`mt-5 w-full rounded-xl py-3 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    doctor.available
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 hover:shadow-cyan-400/40 active:scale-95"
                      : "cursor-not-allowed bg-slate-800/80 text-slate-500"
                  }`}
                >
                  {doctor.available
                    ? "Book Appointment"
                    : "Currently Unavailable"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
