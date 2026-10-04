import {
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  HeartPulse,
  Pill,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user")) || {
    name: "Patient",
  };

  const stats = [
    {
      title: "Upcoming Appointments",
      value: "2",
      icon: CalendarDays,
      description: "Next 30 days",
    },
    {
      title: "Total Appointments",
      value: "8",
      icon: Clock3,
      description: "All time",
    },
    {
      title: "Prescriptions",
      value: "4",
      icon: Pill,
      description: "Active prescriptions",
    },
    {
      title: "Medical Records",
      value: "6",
      icon: FileText,
      description: "Available records",
    },
  ];

  const upcomingAppointments = [
    {
      doctor: "Dr. Rahul Sharma",
      specialty: "Cardiologist",
      date: "05 Oct 2026",
      time: "10:30 AM",
    },
    {
      doctor: "Dr. Priya Verma",
      specialty: "General Physician",
      date: "12 Oct 2026",
      time: "04:00 PM",
    },
  ];

 return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 mt-18">
      {/* Dashboard Content */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-md shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Patient Dashboard
              </div>
              <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back, {user.name} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your appointments, prescriptions and medical records seamlessly.
              </p>
            </div>
            
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-400">System Status</p>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                All Services Online
              </p>
            </div>
          </div>

          {/* Welcome Card */}
          <section className="relative mb-6 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/90 to-slate-900 p-6 shadow-2xl shadow-cyan-950/20 sm:p-7 transition-all duration-300 hover:border-cyan-500/40">
            {/* Background Decorative Glow */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-1 text-cyan-400 border border-cyan-500/20">
                <HeartPulse className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wider uppercase">Your Health, Our Priority</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Take complete control of your well-being</h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Find trusted doctors, book instant appointments, and securely manage all your healthcare information from one unified place.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/find-doctors")}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-400/40 active:scale-95 cursor-pointer"
                >
                  Find a Doctor
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-950/50 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{stat.title}</p>
                      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">{stat.value}</h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-1 w-1 rounded-full bg-cyan-500"></span>
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Main Grid */}
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Upcoming Appointments */}
            <div className="flex flex-col rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:col-span-2 overflow-hidden shadow-xl shadow-slate-950/30">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-900/40">
                <div>
                  <h2 className="text-base font-bold text-white">Upcoming Appointments</h2>
                  <p className="text-xs text-slate-400">
                    Your scheduled consultations and visits
                  </p>
                </div>

                <button
                  onClick={() => navigate("/patient/appointments")}
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300 cursor-pointer"
                >
                  View all
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="divide-y divide-slate-800/60 flex-1">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={`${appointment.doctor}-${appointment.date}`}
                    className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 shadow-inner">
                        <Stethoscope className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">{appointment.doctor}</h3>
                        <p className="mt-0.5 text-xs font-medium text-cyan-400/90">
                          {appointment.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 sm:border-0 sm:pt-0 sm:text-right">
                      <div className="sm:block">
                        <p className="text-xs font-medium text-slate-300">{appointment.date}</p>
                        <p className="mt-0.5 text-xs font-semibold text-cyan-400">
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl shadow-slate-950/30">
              <div className="border-b border-slate-800/80 px-6 py-4 bg-slate-900/40">
                <h2 className="text-base font-bold text-white">Quick Actions</h2>
                <p className="text-xs text-slate-400">
                  Frequently used healthcare services
                </p>
              </div>

              <div className="space-y-2.5 p-4 flex-1">
                <button
                  onClick={() => navigate("/find-doctors")}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-left transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/20 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-transform group-hover:scale-110">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Book Appointment</span>
                      <span className="block text-[11px] text-slate-400">Schedule a visit</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                </button>

                <button
                  onClick={() => navigate("/find-doctors")}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-left transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/20 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-transform group-hover:scale-110">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Find a Doctor</span>
                      <span className="block text-[11px] text-slate-400">Browse specialists</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                </button>

                <button
                  onClick={() => navigate("/patient/medical-records")}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-left transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/20 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-transform group-hover:scale-110">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Medical Records</span>
                      <span className="block text-[11px] text-slate-400">View test results</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                </button>

                <button
                  onClick={() => navigate("/patient/prescriptions")}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-left transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/20 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-transform group-hover:scale-110">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Prescriptions</span>
                      <span className="block text-[11px] text-slate-400">Active medicines</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
