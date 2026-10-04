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
            {/* Hamburger Button (Mobile View) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-[#0b1728] text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            <Link to="/" className="group flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
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

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-cyan-500/10 bg-[#0b1728]/80 p-1.5 backdrop-blur-md shadow-lg shadow-cyan-500/5">
            {/* Patient */}
            {role === "patient" && (
              <>
                <Link
                  to="/patient/dashboard"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/patient/dashboard")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/patient/find-doctors"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/patient/find-doctors")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Find Doctors
                </Link>

                <Link
                  to="/patient/appointments"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/patient/appointments")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
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
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/doctor/dashboard")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/doctor/appointments"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/doctor/appointments")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Appointments
                </Link>

                <Link
                  to="/doctor/patients"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/doctor/patients")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
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
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/admin/dashboard")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/doctors"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/admin/doctors")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Doctors
                </Link>

                <Link
                  to="/admin/patients"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/admin/patients")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Patients
                </Link>

                <Link
                  to="/admin/appointments"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/admin/appointments")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Appointments
                </Link>
              </>
            )}

            {/* Public links when user is not logged in */}
            {!user && (
              <>
                <Link
                  to="/"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/services")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/about")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive("/contact")
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold"
                      : "text-gray-300 hover:bg-[#07111f] hover:text-white"
                  }`}
                >
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* User Section (Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Logged-in User Info */}
            {user && (
              <div
                className={`hidden sm:flex items-center gap-2.5 rounded-xl border border-cyan-500/10 bg-[#0b1728]/80 px-3 py-1.5 backdrop-blur-md transition hover:border-cyan-500/30 ${
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

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-cyan-500/10 bg-[#0b1728]/80 p-2 sm:px-3 sm:py-2 text-xs font-medium text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}

            {/* Login / Register (When not logged in) */}
            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  Login
                </Link>

                <Link
                  to="/patient/register"
                  className="rounded-xl border border-cyan-500/20 bg-[#0b1728] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-cyan-500/40 hover:bg-[#07111f] shadow-lg shadow-cyan-500/5 cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= SMOOTH SLIDING MOBILE SIDEBAR DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop overlay with smooth fade */}
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar Panel with smooth slide-in/out */}
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
                className="p-2 rounded-xl bg-[#0b1728] text-gray-400 hover:text-white border border-cyan-500/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile Summary (If Logged In) */}
            {user && (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (role === "patient") navigate("/patient/profile");
                  else if (role === "doctor") navigate("/doctor/profile");
                  else if (role === "admin") navigate("/admin/profile");
                }}
                className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-[#0b1728] border border-cyan-500/10 cursor-pointer"
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

            {/* Sidebar Links */}
            <div className="space-y-1.5">
              {/* Patient Links */}
              {role === "patient" && (
                <>
                  <Link
                    to="/patient/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/patient/dashboard")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/patient/find-doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/patient/find-doctors")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Find Doctors
                  </Link>
                  <Link
                    to="/patient/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/patient/appointments")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Appointments
                  </Link>
                </>
              )}

              {/* Doctor Links */}
              {role === "doctor" && (
                <>
                  <Link
                    to="/doctor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/doctor/dashboard")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/doctor/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/doctor/appointments")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/doctor/patients"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/doctor/patients")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Patients
                  </Link>
                </>
              )}

              {/* Admin Links */}
              {role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/admin/dashboard")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/admin/doctors")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Doctors
                  </Link>
                  <Link
                    to="/admin/patients"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/admin/patients")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Patients
                  </Link>
                  <Link
                    to="/admin/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/admin/appointments")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Appointments
                  </Link>
                </>
              )}

              {/* Public Links */}
              {!user && (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/services")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Services
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/about")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive("/contact")
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 font-bold"
                        : "text-gray-300 hover:bg-[#0b1728] hover:text-white"
                    }`}
                  >
                    Contact
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Sidebar Footer (Login / Logout Actions) */}
          <div className="pt-4 border-t border-cyan-500/10 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Login
                </Link>
                <Link
                  to="/patient/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-cyan-500/20 bg-[#0b1728] text-white text-xs font-semibold"
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
