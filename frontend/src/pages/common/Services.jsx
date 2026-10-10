import React from "react";
import {
  Stethoscope,
  HeartPulse,
  Brain,
  Eye,
  Baby,
  FlaskConical,
  Ambulance,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Stethoscope,
      title: "General Consultation",
      description:
        "Get professional medical consultation for common health concerns, regular checkups, and general medical advice.",
      points: [
        "General health consultation",
        "Routine checkups",
        "Medical guidance",
      ],
    },
    {
      icon: HeartPulse,
      title: "Cardiology",
      description:
        "Specialized healthcare services focused on heart health, cardiovascular conditions, and preventive care.",
      points: [
        "Heart health consultation",
        "Cardiovascular care",
        "Preventive guidance",
      ],
    },
    {
      icon: Brain,
      title: "Neurology",
      description:
        "Professional consultation for conditions related to the brain, nerves, and nervous system.",
      points: [
        "Neurological consultation",
        "Nerve-related care",
        "Specialist guidance",
      ],
    },
    {
      icon: Eye,
      title: "Eye Care",
      description:
        "Comprehensive eye care services for vision problems and common eye-related conditions.",
      points: [
        "Vision consultation",
        "Eye health checkup",
        "Specialist consultation",
      ],
    },
    {
      icon: Baby,
      title: "Pediatrics",
      description:
        "Healthcare services focused on children's health, development, and common medical needs.",
      points: [
        "Child health consultation",
        "Growth monitoring",
        "Pediatric guidance",
      ],
    },
    {
      icon: FlaskConical,
      title: "Laboratory & Diagnostics",
      description:
        "Diagnostic and laboratory services that help doctors evaluate health conditions accurately.",
      points: ["Diagnostic testing", "Health screening", "Medical evaluation"],
    },
    {
      icon: Ambulance,
      title: "Emergency Care",
      description:
        "Quick medical assistance for urgent healthcare situations requiring immediate attention.",
      points: [
        "Urgent medical assistance",
        "Emergency support",
        "Immediate care",
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Health Checkup",
      description:
        "Routine health checkup services designed to help monitor your overall health.",
      points: [
        "Routine health assessment",
        "Preventive checkup",
        "Health monitoring",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        {/* Modern radial background glow matching reference site vibe */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6 shadow-sm shadow-cyan-500/10">
              <Activity size={14} /> Advanced Healthcare Solutions
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Healthcare Services{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent">
                You Can Trust
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Explore our world-class healthcare services and connect seamlessly
              with qualified medical specialists tailored to your needs.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/find-doctors")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 px-8 py-4 rounded-xl font-bold text-gray-950 transition-all duration-200 shadow-lg shadow-cyan-500/25 text-sm cursor-pointer hover:-translate-y-0.5"
              >
                Find a Doctor
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/find-doctors")}
                className="inline-flex items-center gap-2 bg-[#0b1728] hover:bg-[#0f223c] px-8 py-4 rounded-xl font-bold text-cyan-400 border border-cyan-500/20 transition-all duration-200 text-sm cursor-pointer"
              >
                Explore Specialties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
            What We Offer
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Our Healthcare Services
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            From routine consultations to specialized care, MediCare provides a
            reliable and streamlined healthcare experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group relative bg-[#0b1728]/80 backdrop-blur-xl border border-cyan-500/10 rounded-2xl p-6 hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-cyan-500/5 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top hover glow effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-gray-950 transition-all duration-300 shadow-lg shadow-cyan-500/5">
                    <Icon size={26} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Points */}
                  <div className="mt-5 pt-4 border-t border-cyan-500/10 space-y-2">
                    {service.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-xs text-gray-300"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-cyan-400 shrink-0"
                        />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => navigate("/find-doctors")}
                  className="mt-6 pt-4 border-t border-cyan-500/10 inline-flex items-center justify-between w-full text-cyan-400 group-hover:text-cyan-300 text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  <span>Find Doctor</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1.5 transition-transform duration-200"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#0b1728]/40 border-y border-cyan-500/10 py-20 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Why Medicare
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Healthcare Made Simple
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Everything you need to make your medical journey smooth, secure,
              and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-8 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg mb-5">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Qualified Doctors
              </h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Connect with verified, experienced doctors across multiple
                medical specializations.
              </p>
            </div>

            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-8 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg mb-5">
                <ClipboardCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Easy Appointments
              </h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Book and manage your doctor consultations seamlessly through our
                simple online portal.
              </p>
            </div>

            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-8 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Patient Focused</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Dedicated support and secure health record handling designed
                around your comfort and privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 p-10 sm:p-14 text-center shadow-2xl shadow-cyan-500/15">
          {/* Background overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#07111f_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Need to See a Doctor?
            </h2>
            <p className="mt-3 text-sm text-gray-900 font-medium">
              Find the right medical expert and book your appointment instantly
              today.
            </p>
            <button
              onClick={() => navigate("/find-doctors")}
              className="mt-8 inline-flex items-center gap-2 bg-[#07111f] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0b1728] transition-all duration-200 shadow-xl text-sm cursor-pointer hover:-translate-y-0.5"
            >
              Find Doctors Now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
