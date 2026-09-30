import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Stethoscope, UserRound } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Stethoscope size={21} />
            </div>

            <span className="text-xl font-bold">
              Medi<span className="text-blue-500">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-slate-300 hover:text-white transition">
              Home
            </Link>

            <Link
              to="/services"
              className="text-slate-300 hover:text-white transition"
            >
              Services
            </Link>

            <Link
              to="/patient/doctors"
              className="text-slate-300 hover:text-white transition"
            >
              Find Doctors
            </Link>

            <Link
              to="/about"
              className="text-slate-300 hover:text-white transition"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-slate-300 hover:text-white transition"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-slate-300 hover:text-white transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              <UserRound size={17} />
              Register
            </button>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300"
          >
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 py-4">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/services"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Services
              </Link>

              <Link
                to="/patient/doctors"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Find Doctors
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                About
              </Link>

              <Link
                to="/contact"
                onClick={closeMenu}
                className="px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Contact
              </Link>

              <div className="border-t border-slate-800 mt-2 pt-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                  className="px-3 py-3 text-left text-slate-300 hover:bg-slate-900 rounded-lg"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/register");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-3 rounded-lg text-left"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
