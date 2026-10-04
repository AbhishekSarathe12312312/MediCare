import {
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Brain,
  Ambulance,
  CalendarDays,
  UserRound,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Stethoscope,
      title: "General Consultation",
    },
    {
      icon: HeartPulse,
      title: "Cardiology",
    },
    {
      icon: Brain,
      title: "Neurology",
    },
    {
      icon: Ambulance,
      title: "Emergency Care",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Trusted Doctors",
      description: "Qualified and experienced doctors for quality healthcare.",
    },
    {
      icon: Clock3,
      title: "Easy Appointments",
      description: "Book appointments quickly without waiting in long queues.",
    },
    {
      icon: CalendarDays,
      title: "Manage Appointments",
      description: "View, cancel, and manage appointments easily.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-[#07111f] to-[#07111f]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-cyan-400">
              Welcome to MediCare
            </span>

            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
              Your Health,
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {" "}
                Our Priority
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-gray-400 leading-relaxed">
              Find trusted doctors, explore healthcare services, and book
              appointments online with ease.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/patient/find-doctors")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 px-6 py-3 font-bold text-gray-950 transition shadow-lg shadow-cyan-500/20 text-xs sm:text-sm cursor-pointer"
              >
                Find Doctors
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/services")}
                className="rounded-xl border border-cyan-500/20 bg-[#0b1728]/80 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-medium text-white transition hover:border-cyan-500/40 hover:bg-[#0b1728] cursor-pointer shadow-lg shadow-cyan-500/5"
              >
                Our Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Services
          </span>

          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Healthcare Services
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            Comprehensive healthcare solutions for every need.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-6 transition hover:border-cyan-500/30 shadow-xl shadow-cyan-500/5 group"
              >
                <div className="mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 group-hover:scale-105 transition">
                  <Icon className="text-cyan-400" size={24} />
                </div>

                <h3 className="font-semibold text-base sm:text-lg text-white">
                  {service.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#0b1728]/50 border-y border-cyan-500/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              How It Works
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Simple Process
            </h2>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f] p-6 sm:p-8 text-center shadow-xl shadow-cyan-500/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 mb-2">
                <UserRound size={32} className="text-cyan-400" />
              </div>

              <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">
                Create Account
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
                Register and complete your profile.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f] p-6 sm:p-8 text-center shadow-xl shadow-cyan-500/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 mb-2">
                <Stethoscope size={32} className="text-cyan-400" />
              </div>

              <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">
                Find Doctor
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
                Choose a suitable specialist.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/10 bg-[#07111f] p-6 sm:p-8 text-center shadow-xl shadow-cyan-500/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 mb-2">
                <CalendarDays size={32} className="text-cyan-400" />
              </div>

              <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">
                Book Appointment
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
                Schedule your appointment online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Why Choose MediCare?
          </h2>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                  <Icon size={24} className="text-cyan-400" />
                </div>

                <h3 className="mt-5 text-lg sm:text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500 to-teal-500 p-8 sm:p-14 text-center shadow-xl shadow-cyan-500/10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950 tracking-tight">
            Book Your Appointment Today
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-gray-900 font-medium max-w-xl mx-auto">
            Connect with trusted doctors and get quality healthcare.
          </p>

          <button
            onClick={() => navigate("/patient/find-doctors")}
            className="mt-6 sm:mt-7 rounded-xl bg-[#07111f] px-6 py-3 font-bold text-white transition hover:bg-[#0b1728] shadow-lg text-xs sm:text-sm cursor-pointer"
          >
            Find Doctors
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
