import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get logged-in user from sessionStorage
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  });

  const role = user?.role;

  // Sync user after login/logout
  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      setUser(storedUser);
    };

    window.addEventListener("authChanged", syncUser);

    return () => {
      window.removeEventListener("authChanged", syncUser);
    };
  }, []);

  // Navbar scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  // Active route
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 w-full border-b border-cyan-500/10 bg-[#07111f]/85 backdrop-blur-xl transition-transform duration-300 shadow-xl shadow-cyan-500/5 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-[#0b1728] text-cyan-400 hover:border-cyan-500/40 transition duration-300 cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-105">
                <Stethoscope size={20} className="text-gray-950" />
              </div>

              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-white">Medi</span>
                <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Care
                </span>
              </span>
            </Link>
          </div>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-cyan-500/10 bg-[#0b1728]/80 p-1.5 backdrop-blur-md shadow-lg shadow-cyan-500/5">
            {/* ================= PATIENT ================= */}
            {role === "patient" && (
              <>
                <Link
                  to="/patient/dashboard"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/patient/dashboard")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Dashboard</span>
                </Link>

                <Link
                  to="/find-doctors"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/find-doctors")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Find Doctors</span>
                </Link>

                <Link
                  to="/patient/appointments"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/patient/appointments")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Appointments</span>
                </Link>
              </>
            )}

            {/* ================= DOCTOR ================= */}
            {role === "doctor" && (
              <>
                <Link
                  to="/doctor/dashboard"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/doctor/dashboard")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Dashboard</span>
                </Link>

                <Link
                  to="/doctor/appointments"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/doctor/appointments")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Appointments</span>
                </Link>

                <Link
                  to="/doctor/patients"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/doctor/patients")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Patients</span>
                </Link>
              </>
            )}

            {/* ================= ADMIN ================= */}
            {role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/admin/dashboard")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Dashboard</span>
                </Link>

                <Link
                  to="/admin/doctors"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/admin/doctors")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Doctors</span>
                </Link>

                <Link
                  to="/admin/patients"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/admin/patients")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Patients</span>
                </Link>

                <Link
                  to="/admin/appointments"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/admin/appointments")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Appointments</span>
                </Link>
              </>
            )}

            {/* ================= PUBLIC LINKS ================= */}
            {!user && (
              <>
                <Link
                  to="/"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Home</span>
                </Link>

                <Link
                  to="/services"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/services")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Services</span>
                </Link>

                <Link
                  to="/about"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/about")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">About</span>
                </Link>

                <Link
                  to="/contact"
                  className={`relative overflow-hidden rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ease-in-out ${
                    isActive("/contact")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold scale-[1.02]"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white hover:scale-[1.02]"
                  }`}
                >
                  <span className="relative z-10">Contact</span>
                </Link>
              </>
            )}
          </div>

          {/* ================= USER SECTION ================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Logged-in User */}
            {user && (
              <div
                className={`hidden sm:flex items-center gap-2.5 rounded-xl border border-cyan-500/10 bg-[#0b1728]/80 px-3 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 ${
                  role === "patient" || role === "doctor" || role === "admin"
                    ? "cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (role === "patient") navigate("/patient/profile");
                  else if (role === "doctor") navigate("/doctor/profile");
                  else if (role === "admin") navigate("/admin/profile");
                }}
              >
                <div className="h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 shadow-inner flex-shrink-0">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-cyan-400">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-medium capitalize text-cyan-400">
                    {role}
                  </p>
                </div>
              </div>
            )}

            {/* Logout */}
            {user && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-cyan-500/10 bg-[#0b1728]/80 p-2 sm:px-3 sm:py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}

            {/* Login / Register */}
            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                >
                  Login
                </Link>

                <Link
                  to="/patient/register"
                  className="rounded-xl border border-cyan-500/20 bg-[#0b1728] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#07111f] shadow-lg shadow-cyan-500/5 cursor-pointer hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-72 sm:w-80 bg-[#07111f] border-r border-cyan-500/10 p-5 shadow-2xl flex flex-col justify-between z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/10 mb-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950">
                  <Stethoscope size={18} />
                </div>

                <span className="text-lg font-bold text-white">
                  Medi<span className="text-cyan-400">Care</span>
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-[#0b1728] text-gray-400 hover:text-white border border-cyan-500/10 cursor-pointer transition-all duration-300 hover:rotate-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile */}
            {user && (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);

                  if (role === "patient") navigate("/patient/profile");
                  else if (role === "doctor") navigate("/doctor/profile");
                  else if (role === "admin") navigate("/admin/profile");
                }}
                className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-[#0b1728] border border-cyan-500/10 cursor-pointer transition-all duration-300 hover:border-cyan-500/30"
              >
                <div className="h-10 w-10 overflow-hidden rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    {user.name || "User"}
                  </p>

                  <p className="text-[10px] font-medium capitalize text-cyan-400">
                    {role}
                  </p>
                </div>
              </div>
            )}

            {/* ================= MOBILE LINKS ================= */}
            <div className="space-y-1.5">
              {/* Patient */}
              {role === "patient" && (
                <>
                  <Link
                    to="/patient/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/patient/dashboard")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/find-doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/find-doctors")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Find Doctors
                  </Link>

                  <Link
                    to="/patient/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/patient/appointments")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Appointments
                  </Link>
                </>
              )}

              {/* Doctor */}
              {role === "doctor" && (
                <>
                  <Link
                    to="/doctor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/doctor/dashboard")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/doctor/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/doctor/appointments")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Appointments
                  </Link>

                  <Link
                    to="/doctor/patients"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/doctor/patients")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Patients
                  </Link>
                </>
              )}

              {/* Admin */}
              {role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/admin/dashboard")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/admin/doctors")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Doctors
                  </Link>

                  <Link
                    to="/admin/patients"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/admin/patients")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Patients
                  </Link>

                  <Link
                    to="/admin/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/admin/appointments")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Appointments
                  </Link>
                </>
              )}

              {/* Public */}
              {!user && (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Home
                  </Link>

                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/services")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Services
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/about")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    About
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-500 ease-in-out ${
                      isActive("/contact")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold translate-x-1 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    Contact
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ================= MOBILE FOOTER ================= */}
          <div className="pt-4 border-t border-cyan-500/10 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all duration-300 cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Login
                </Link>

                <Link
                  to="/patient/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-cyan-500/20 bg-[#0b1728] text-white text-xs font-semibold transition-all duration-300 hover:border-cyan-500/40 hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
