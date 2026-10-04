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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-slate-950" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              Welcome to MediCare
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-7xl">
              Your Health,
              <span className="text-blue-500"> Our Priority</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-400">
              Find trusted doctors, explore healthcare services, and book
              appointments online with ease.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/patient/find-doctors")}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
              >
                Find Doctors
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/services")}
                className="rounded-xl border border-slate-700 px-6 py-3 transition hover:bg-slate-900"
              >
                Our Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <p className="text-blue-500 font-medium">SERVICES</p>

          <h2 className="mt-2 text-4xl font-bold">Healthcare Services</h2>

          <p className="mt-4 text-slate-400">
            Comprehensive healthcare solutions for every need.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon className="text-blue-400" size={28} />
                </div>

                <h3 className="font-semibold">{service.title}</h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-blue-500 font-medium">HOW IT WORKS</p>

            <h2 className="mt-2 text-4xl font-bold">Simple Process</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
              <UserRound size={45} className="mx-auto text-blue-400" />

              <h3 className="mt-5 text-xl font-semibold">Create Account</h3>

              <p className="mt-3 text-slate-400">
                Register and complete your profile.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
              <Stethoscope size={45} className="mx-auto text-blue-400" />

              <h3 className="mt-5 text-xl font-semibold">Find Doctor</h3>

              <p className="mt-3 text-slate-400">
                Choose a suitable specialist.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">
              <CalendarDays size={45} className="mx-auto text-blue-400" />

              <h3 className="mt-5 text-xl font-semibold">Book Appointment</h3>

              <p className="mt-3 text-slate-400">
                Schedule your appointment online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Why Choose MediCare?</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
              >
                <Icon size={40} className="text-blue-400" />

                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>

                <p className="mt-3 text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center">
          <h2 className="text-4xl font-bold">Book Your Appointment Today</h2>

          <p className="mt-4 text-blue-100">
            Connect with trusted doctors and get quality healthcare.
          </p>

          <button
            onClick={() => navigate("/patient/find-doctors")}
            className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Find Doctors
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
