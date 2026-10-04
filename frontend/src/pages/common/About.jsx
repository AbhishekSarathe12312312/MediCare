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
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950 mt-7">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-950/20 via-[#07111f] to-[#07111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              About MediCare
            </span>

            <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Making Healthcare
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {" "}
                Simple & Accessible
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 leading-relaxed">
              MediCare is a digital healthcare platform designed to help
              patients find doctors, explore healthcare services, and manage
              appointments conveniently.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Who We Are
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Healthcare technology built around patients
            </h2>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 leading-relaxed">
              MediCare provides a convenient way for patients to discover
              doctors and schedule medical appointments. The platform also helps
              doctors manage their appointments and provides administrators with
              tools to manage the healthcare system.
            </p>

            <button
              onClick={() => navigate("/services")}
              className="mt-6 sm:mt-7 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-gray-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 text-xs sm:text-sm cursor-pointer"
            >
              Explore Services
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-cyan-500/5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
              <HeartPulse size={30} className="text-cyan-400 sm:w-8 sm:h-8" />
            </div>

            <h3 className="mt-5 sm:mt-6 text-xl sm:text-2xl font-semibold text-white">
              Our Mission
            </h3>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 leading-relaxed">
              To create a simple and reliable digital experience that makes
              healthcare discovery and appointment management easier for
              patients, doctors, and healthcare administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0b1728]/50 border-y border-cyan-500/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Our Values
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              What We Focus On
            </h2>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-6 shadow-lg shadow-cyan-500/5 hover:border-cyan-500/30 transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                    <Icon size={22} className="text-cyan-400" />
                  </div>

                  <h3 className="mt-4 sm:mt-5 font-semibold text-base sm:text-lg text-white">
                    {value.title}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500 to-teal-500 p-8 sm:p-14 text-center shadow-xl shadow-cyan-500/10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950 tracking-tight">
            Start Your Healthcare Journey
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-gray-900 font-medium max-w-xl mx-auto">
            Find a doctor and book your appointment today.
          </p>

          <button
            onClick={() => navigate("/find-doctors")}
            className="mt-6 sm:mt-7 bg-[#07111f] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0b1728] transition shadow-lg text-xs sm:text-sm cursor-pointer"
          >
            Find Doctors
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
