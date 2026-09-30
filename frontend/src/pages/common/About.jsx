import {
  ShieldCheck,
  HeartPulse,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: HeartPulse,
      title: "Patient First",
      description:
        "We focus on making healthcare simple, accessible, and convenient for every patient.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Healthcare",
      description:
        "MediCare connects patients with qualified doctors and organized healthcare services.",
    },
    {
      icon: Users,
      title: "Easy Access",
      description:
        "Find doctors and manage appointments through a simple digital healthcare experience.",
    },
    {
      icon: Target,
      title: "Better Experience",
      description:
        "Our goal is to reduce complexity and make the appointment process easier.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-blue-500 font-medium">ABOUT MEDICARE</p>

            <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
              Making Healthcare
              <span className="text-blue-500"> Simple & Accessible</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              MediCare is a digital healthcare platform designed to help
              patients find doctors, explore healthcare services, and manage
              appointments conveniently.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-500 font-medium">WHO WE ARE</p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Healthcare technology built around patients
            </h2>

            <p className="mt-6 text-slate-400 leading-relaxed">
              MediCare provides a convenient way for patients to discover
              doctors and schedule medical appointments. The platform also helps
              doctors manage their appointments and provides administrators with
              tools to manage the healthcare system.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="mt-7 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition"
            >
              Explore Services
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <HeartPulse size={34} className="text-blue-500" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold">Our Mission</h3>

            <p className="mt-4 text-slate-400 leading-relaxed">
              To create a simple and reliable digital experience that makes
              healthcare discovery and appointment management easier for
              patients, doctors, and healthcare administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-blue-500 font-medium">OUR VALUES</p>

            <h2 className="mt-2 text-3xl md:text-4xl font-bold">
              What We Focus On
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Icon size={24} className="text-blue-500" />
                  </div>

                  <h3 className="mt-5 font-semibold text-lg">{value.title}</h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-blue-600 p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Start Your Healthcare Journey
          </h2>

          <p className="mt-4 text-blue-100">
            Find a doctor and book your appointment today.
          </p>

          <button
            onClick={() => navigate("/patient/doctors")}
            className="mt-7 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Find Doctors
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
