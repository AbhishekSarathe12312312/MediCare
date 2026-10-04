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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-[#07111f] to-[#07111f]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Medicare Services
            </span>

            <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              Healthcare Services
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {" "}
                You Can Trust
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-400 leading-relaxed">
              Explore our healthcare services and connect with qualified doctors
              for your medical needs.
            </p>

            <button
              onClick={() => navigate("/patient/find-doctors")}
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 px-6 py-3.5 rounded-xl font-bold text-gray-950 transition shadow-lg shadow-cyan-500/20 text-xs sm:text-sm cursor-pointer"
            >
              Find a Doctor
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
            What We Offer
          </span>

          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Our Healthcare Services
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            From routine consultations to specialized care, MediCare provides a
            convenient healthcare experience.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group bg-[#0b1728]/80 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-6 hover:border-cyan-500/30 hover:-translate-y-1 transition duration-300 shadow-xl shadow-cyan-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-gray-950 transition shadow-lg shadow-cyan-500/5">
                    <Icon size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-semibold text-white">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Points */}
                  <div className="mt-4 sm:mt-5 space-y-2">
                    {service.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-xs sm:text-sm text-gray-300"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-cyan-400 shrink-0"
                        />

                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => navigate("/patient/find-doctors")}
                  className="mt-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  Find Doctor
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#0b1728]/50 border-y border-cyan-500/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Why Medicare
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Healthcare Made Simple
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-gray-400">
              Everything you need to make your healthcare journey easier and
              more convenient.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-6 sm:p-7 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <Stethoscope size={24} className="text-cyan-400" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold text-white">
                Qualified Doctors
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                Connect with doctors across different medical specializations.
              </p>
            </div>

            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-6 sm:p-7 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <ClipboardCheck size={24} className="text-cyan-400" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold text-white">
                Easy Appointments
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                Find a doctor and book your appointment through a simple online
                process.
              </p>
            </div>

            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-6 sm:p-7 shadow-xl shadow-cyan-500/5 hover:border-cyan-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                <HeartPulse size={24} className="text-cyan-400" />
              </div>

              <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-semibold text-white">
                Patient Focused
              </h3>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                Designed to provide a smooth and convenient healthcare
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500 to-teal-500 p-8 sm:p-14 text-center shadow-xl shadow-cyan-500/10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950 tracking-tight">
            Need to See a Doctor?
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-gray-900 font-medium max-w-xl mx-auto">
            Find the right doctor and book your appointment today.
          </p>

          <button
            onClick={() => navigate("/patient/find-doctors")}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 bg-[#07111f] text-white px-7 py-3.5 rounded-xl font-bold hover:bg-[#0b1728] transition shadow-lg text-xs sm:text-sm cursor-pointer"
          >
            Find Doctors
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;
