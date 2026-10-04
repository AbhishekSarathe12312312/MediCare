import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-transform duration-300 shadow-xl shadow-slate-950/20 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
            <Stethoscope size={20} className="text-slate-950" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            <span className="text-white">Medi</span>
            <span className="text-cyan-400">Care</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-900/60 p-1.5 backdrop-blur-md">
          {/* Patient */}
          {role === "patient" && (
            <>
              <Link
                to="/patient/dashboard"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/patient/dashboard")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/patient/find-doctors"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/patient/find-doctors")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Find Doctors
              </Link>

              <Link
                to="/patient/appointments"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/patient/appointments")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/doctor/appointments"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/doctor/appointments")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Appointments
              </Link>

              <Link
                to="/doctor/patients"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/doctor/patients")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/doctors"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/admin/doctors")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Doctors
              </Link>

              <Link
                to="/admin/patients"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/admin/patients")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Patients
              </Link>

              <Link
                to="/admin/appointments"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isActive("/admin/appointments")
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Appointments
              </Link>
            </>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {/* Logged-in User */}
          {user && (
            <div
              className={`flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-1.5 backdrop-blur-md transition hover:border-cyan-500/30 ${
                role === "patient" || role === "doctor" || role === "admin"
                  ? "cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                if (role === "patient") {
                  navigate("/patient/profile");
                } else if (role === "doctor") {
                  navigate("/doctor/profile");
                } else if (role === "admin") {
                  navigate("/admin/profile");
                }
              }}
            >
              {/* Profile Image */}
              <div className="h-9 w-9 overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 shadow-inner">
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

              {/* User Details */}
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold text-white">
                  {user.name || "User"}
                </p>
                <p className="text-[11px] font-medium capitalize text-cyan-400">
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
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 sm:px-3.5 sm:py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}

          {/* Login / Register */}
          {!user && (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              >
                Login
              </Link>

              <Link
                to="/patient/register"
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-slate-700 hover:bg-slate-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
