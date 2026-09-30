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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-blue-500 font-semibold tracking-wide">
              MEDICARE SERVICES
            </p>

            <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
              Healthcare Services
              <span className="text-blue-500"> You Can Trust</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Explore our healthcare services and connect with qualified doctors
              for your medical needs.
            </p>

            <button
              onClick={() => navigate("/patient/doctors")}
              className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-xl font-medium transition"
            >
              Find a Doctor
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-blue-500 font-medium">WHAT WE OFFER</p>

          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Our Healthcare Services
          </h2>

          <p className="mt-4 text-slate-400">
            From routine consultations to specialized care, MediCare provides a
            convenient healthcare experience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icon size={27} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>

                {/* Description */}
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Points */}
                <div className="mt-5 space-y-2">
                  {service.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-blue-500 shrink-0"
                      />

                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => navigate("/patient/doctors")}
                  className="mt-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
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
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-blue-500 font-medium">WHY MEDICARE</p>

            <h2 className="mt-2 text-3xl md:text-4xl font-bold">
              Healthcare Made Simple
            </h2>

            <p className="mt-4 text-slate-400">
              Everything you need to make your healthcare journey easier and
              more convenient.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Stethoscope size={24} className="text-blue-500" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">Qualified Doctors</h3>

              <p className="mt-3 text-slate-400">
                Connect with doctors across different medical specializations.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ClipboardCheck size={24} className="text-blue-500" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">Easy Appointments</h3>

              <p className="mt-3 text-slate-400">
                Find a doctor and book your appointment through a simple online
                process.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <HeartPulse size={24} className="text-blue-500" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">Patient Focused</h3>

              <p className="mt-3 text-slate-400">
                Designed to provide a smooth and convenient healthcare
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Need to See a Doctor?
          </h2>

          <p className="mt-4 text-blue-100">
            Find the right doctor and book your appointment today.
          </p>

          <button
            onClick={() => navigate("/patient/doctors")}
            className="mt-8 inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition"
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
