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
          "http://localhost:8000/api/doctor/get-doctors",
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
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-cyan-400">MediCare</p>

          <h1 className="text-3xl font-bold md:text-4xl">Find a Doctor</h1>

          <p className="mt-2 text-slate-400">
            Find the right doctor and book your appointment easily.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search doctor or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            {/* Specialization */}
            <div className="relative lg:w-64">
              <SlidersHorizontal
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-500"
              >
                {specializations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Doctors</h2>

          <span className="text-sm text-slate-400">
            {filteredDoctors.length} doctors found
          </span>
        </div>

        {/* No Doctors */}
        {filteredDoctors.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 py-16 text-center">
            <Stethoscope size={42} className="mx-auto mb-4 text-slate-600" />

            <h3 className="text-lg font-semibold">No doctors found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or specialization.
            </p>
          </div>
        ) : (
          /* Doctors */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-500/40"
              >
                {/* Doctor Top */}
                <div className="flex items-start gap-4">
                  {/* Doctor Image / Avatar */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-500/10 text-cyan-400">
                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Stethoscope size={28} />
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold">
                      {doctor.name}
                    </h3>

                    <p className="mt-1 text-sm text-cyan-400">
                      {doctor.specialization}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-sm text-slate-400">
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span>{doctor.rating || "New"}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="mt-5 space-y-3 border-t border-slate-800 pt-4">
                  {/* Experience */}
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <CalendarDays size={17} />

                    <span>{doctor.experience} Years experience</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <MapPin size={17} />

                    <span>{doctor.location || "Bhopal"}</span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        doctor.available ? "bg-green-400" : "bg-red-400"
                      }`}
                    />

                    <span
                      className={
                        doctor.available ? "text-green-400" : "text-red-400"
                      }
                    >
                      {doctor.available
                        ? "Available for appointment"
                        : "Currently unavailable"}
                    </span>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-slate-500">
                      Consultation Fee
                    </span>

                    <span className="font-semibold text-white">
                      ₹{doctor.consultationFee}
                    </span>
                  </div>
                </div>

                {/* Book Appointment */}
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  disabled={!doctor.available}
                  className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition ${
                    doctor.available
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      : "cursor-not-allowed bg-slate-800 text-slate-500"
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
