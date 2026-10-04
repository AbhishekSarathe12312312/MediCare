import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Stethoscope,
  LayoutDashboard,
  Users,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
  Save,
  Camera,
} from "lucide-react";

const AdminEditDoctor = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    location: "",
    about: "",
    available: true,
    isActive: true,
  });

  // =========================
  // Fetch Doctor
  // =========================

  const fetchDoctor = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/doctors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const doctor = response.data.doctors.find(
          (item) => item._id === doctorId,
        );

        if (!doctor) {
          toast.error("Doctor not found");
          navigate("/admin/doctors");
          return;
        }

        setFormData({
          name: doctor.name || "",
          email: doctor.email || "",
          phone: doctor.phone || "",
          specialization: doctor.specialization || "",
          qualification: doctor.qualification || "",
          experience: doctor.experience ?? "",
          consultationFee: doctor.consultationFee ?? "",
          location: doctor.location || "",
          about: doctor.about || "",
          available: doctor.available !== false,
          isActive: doctor.isActive !== false,
        });

        setImagePreview(doctor.profileImage || "");
      }
    } catch (error) {
      console.error("FETCH DOCTOR ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.error("Session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        navigate("/admin/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load doctor");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedAdmin = sessionStorage.getItem("admin");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    fetchDoctor(token);
  }, [doctorId]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Image Change
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Image type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    // 5MB validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================
  // Toggle
  // =========================

  const handleToggle = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // =========================
  // Update Doctor
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.specialization.trim() ||
      !formData.qualification.trim() ||
      formData.experience === "" ||
      formData.consultationFee === ""
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSaving(true);

      // =========================
      // FormData
      // =========================

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("specialization", formData.specialization.trim());
      data.append("qualification", formData.qualification.trim());
      data.append("experience", Number(formData.experience));
      data.append("consultationFee", Number(formData.consultationFee));
      data.append("location", formData.location.trim());
      data.append("about", formData.about.trim());
      data.append("available", formData.available);
      data.append("isActive", formData.isActive);

      // Only append image when admin selects a new one
      if (imageFile) {
        data.append("file", imageFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctorId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Doctor updated successfully");

        navigate("/admin/doctors");
      }
    } catch (error) {
      console.error("UPDATE DOCTOR ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.error("Session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to update doctor");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/admin/login");
  };

  // =========================
  // Navigation
  // =========================

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-gray-700 border-t-cyan-400" />

          <p className="text-sm text-gray-400">Loading doctor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72
          border-r border-cyan-500/10
          bg-[#0b1728]/90 backdrop-blur-xl
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-cyan-500/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 shadow-lg shadow-cyan-500/5">
              <Stethoscope size={23} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                Medi
                <span className="text-cyan-400">Care</span>
              </h1>

              <p className="text-[11px] text-gray-400">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            <button
              onClick={() => handleNavigation("/admin/dashboard")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-cyan-500/5 hover:text-cyan-300"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              onClick={() => handleNavigation("/admin/doctors")}
              className="flex w-full items-center gap-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-3 text-sm font-medium text-cyan-400 shadow-sm shadow-cyan-500/5"
            >
              <Stethoscope size={19} />
              Doctors
            </button>

            <button
              onClick={() => handleNavigation("/admin/patients")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-cyan-500/5 hover:text-cyan-300"
            >
              <Users size={19} />
              Patients
            </button>

            <button
              onClick={() => handleNavigation("/admin/appointments")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-cyan-500/5 hover:text-cyan-300"
            >
              <CalendarDays size={19} />
              Appointments
            </button>
          </nav>
        </div>

        {/* Admin */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-cyan-500/10 p-4 bg-[#0b1728]">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#07111f] border border-cyan-500/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <ShieldCheck size={20} className="text-cyan-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {admin?.name || "Admin"}
              </p>

              <p className="truncate text-xs text-gray-400">
                {admin?.email || "admin@medicare.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* =========================
          Main
      ========================= */}

      <main className="lg:ml-72">
        {/* Header */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-cyan-500/10 bg-[#07111f]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-300 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-xl font-semibold sm:text-2xl tracking-tight">
                Edit Doctor
              </h2>

              <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                Update doctor information
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/20 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-cyan-500/5 hover:text-cyan-300"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </header>

        {/* Content */}

        <div className="p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            {/* Doctor Information */}

            <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 sm:p-7 shadow-lg shadow-cyan-500/5">
              <div className="mb-7">
                <h3 className="text-lg font-semibold">Doctor Information</h3>

                <p className="mt-1 text-sm text-gray-400">
                  Update the doctor's professional information.
                </p>
              </div>

              {/* Profile Image */}

              <div className="mb-7 flex items-center gap-5">
                <div className="relative">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-500/20 bg-[#07111f]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={formData.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Stethoscope size={35} className="text-cyan-400/60" />
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="doctor-profile-image"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#0b1728] bg-cyan-500 text-gray-950 font-bold transition hover:bg-cyan-400 shadow-md"
                  >
                    <Camera size={15} />
                  </label>

                  <input
                    id="doctor-profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Profile Image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Click the camera icon to change the image.
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP • Maximum 5MB
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Doctor Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Doctor name"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    placeholder="Doctor email"
                    className="w-full cursor-not-allowed rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </div>

                {/* Specialization */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Cardiologist"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Qualification */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. MBBS, MD"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Experience */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Fee */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Consultation Fee
                  </label>

                  <input
                    type="number"
                    name="consultationFee"
                    min="0"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Location */}

                <div>
                  <label className="mb-2 block text-sm text-gray-300 font-medium">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bhopal"
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              {/* About */}

              <div className="mt-5">
                <label className="mb-2 block text-sm text-gray-300 font-medium">
                  About Doctor
                </label>

                <textarea
                  name="about"
                  rows="5"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Write something about the doctor..."
                  className="w-full resize-none rounded-xl border border-cyan-500/10 bg-[#07111f] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Status Settings */}

            <div className="mt-5 rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md p-5 sm:p-7 shadow-lg shadow-cyan-500/5">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Status Settings</h3>

                <p className="mt-1 text-sm text-gray-400">
                  Control the doctor's account and appointment availability.
                </p>
              </div>

              <div className="space-y-4">
                {/* Account Status */}

                <div className="flex items-center justify-between gap-4 rounded-xl bg-[#07111f] border border-cyan-500/10 p-4">
                  <div>
                    <p className="text-sm font-medium">Account Status</p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formData.isActive
                        ? "Doctor can login to the system."
                        : "Doctor cannot login to the system."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle("isActive")}
                    className={`
                      relative h-7 w-12 rounded-full transition
                      ${formData.isActive ? "bg-emerald-500" : "bg-gray-700"}
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 h-5 w-5 rounded-full bg-white transition shadow-sm
                        ${formData.isActive ? "left-6" : "left-1"}
                      `}
                    />
                  </button>
                </div>

                {/* Availability */}

                <div className="flex items-center justify-between gap-4 rounded-xl bg-[#07111f] border border-cyan-500/10 p-4">
                  <div>
                    <p className="text-sm font-medium">
                      Appointment Availability
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formData.available
                        ? "Patients can book appointments."
                        : "Patients cannot book appointments."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle("available")}
                    className={`
                      relative h-7 w-12 rounded-full transition
                      ${formData.available ? "bg-cyan-500" : "bg-gray-700"}
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 h-5 w-5 rounded-full bg-white transition shadow-sm
                        ${formData.available ? "left-6" : "left-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/doctors")}
                className="rounded-xl border border-cyan-500/20 px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-cyan-500/5 hover:text-cyan-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminEditDoctor;
