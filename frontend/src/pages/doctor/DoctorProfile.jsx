import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  LogOut,
  Stethoscope,
  Menu,
  X,
  CircleUserRound,
  Save,
  MapPin,
  Phone,
  Mail,
  BriefcaseMedical,
  GraduationCap,
  IndianRupee,
  FileText,
  CheckCircle2,
  Power,
  Camera,
} from "lucide-react";

const DoctorProfile = () => {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    location: "",
    about: "",
    available: true,
  });

  // Fetch doctor profile
  useEffect(() => {
    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    fetchProfile(token);
  }, [navigate]);

  const fetchProfile = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "${import.meta.env.VITE_API_URL}/api/doctor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const doctorData = response.data.doctor;

        setDoctor(doctorData);

        setFormData({
          name: doctorData.name || "",
          phone: doctorData.phone || "",
          specialization: doctorData.specialization || "",
          qualification: doctorData.qualification || "",
          experience: doctorData.experience ?? "",
          consultationFee: doctorData.consultationFee ?? "",
          location: doctorData.location || "",
          about: doctorData.about || "",
          available: doctorData.available ?? true,
        });

        setPreviewImage(doctorData.profileImage || "");

        // Keep latest doctor data in localStorage
        localStorage.setItem("doctor", JSON.stringify(doctorData));
      }
    } catch (error) {
      console.error("FETCH DOCTOR PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        toast.error("Session expired. Please login again.");

        navigate("/doctor/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        navigate("/doctor/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profile image change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImage(file);

    // Local preview
    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  // Availability toggle
  const handleAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      available: !prev.available,
    }));
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("doctorToken");

    if (!token) {
      navigate("/doctor/login");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!formData.specialization.trim()) {
      toast.error("Specialization is required");
      return;
    }

    if (!formData.qualification.trim()) {
      toast.error("Qualification is required");
      return;
    }

    if (formData.experience === "" || Number(formData.experience) < 0) {
      toast.error("Enter a valid experience");
      return;
    }

    if (
      formData.consultationFee === "" ||
      Number(formData.consultationFee) < 0
    ) {
      toast.error("Enter a valid consultation fee");
      return;
    }

    try {
      setSaving(true);

      // Create FormData
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

      // Add new profile image only if selected
      if (profileImage) {
        data.append("file", profileImage);
      }

      const response = await axios.put(
        "${import.meta.env.VITE_API_URL}/api/doctor/profile-update",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const updatedDoctor = response.data.doctor;

        setDoctor(updatedDoctor);

        setFormData({
          name: updatedDoctor.name || "",
          phone: updatedDoctor.phone || "",
          specialization: updatedDoctor.specialization || "",
          qualification: updatedDoctor.qualification || "",
          experience: updatedDoctor.experience ?? "",
          consultationFee: updatedDoctor.consultationFee ?? "",
          location: updatedDoctor.location || "",
          about: updatedDoctor.about || "",
          available: updatedDoctor.available ?? true,
        });

        setPreviewImage(updatedDoctor.profileImage || "");

        setProfileImage(null);

        localStorage.setItem("doctor", JSON.stringify(updatedDoctor));

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("UPDATE DOCTOR PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctor");

        toast.error("Session expired. Please login again.");

        navigate("/doctor/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    toast.success("Logged out successfully");

    navigate("/doctor/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Stethoscope size={21} />
            </div>

            <div>
              <h1 className="font-bold text-white">MediCare</h1>

              <p className="text-xs text-slate-500">Doctor Portal</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-600/20">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CircleUserRound size={28} className="text-blue-400" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                {doctor.name}
              </h2>

              <p className="truncate text-xs text-slate-500">
                {doctor.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          <button
            onClick={() => {
              navigate("/doctor/dashboard");
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/doctor/appointments");
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <CalendarDays size={19} />
            Appointments
          </button>

          <button
            onClick={() => {
              navigate("/doctor/profile");
              setSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl bg-blue-600/10 px-4 py-3 text-sm font-medium text-blue-400"
          >
            <UserRound size={19} />
            My Profile
          </button>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">My Profile</h2>

              <p className="hidden text-sm text-slate-500 sm:block">
                Manage your professional profile
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 transition hover:bg-slate-800"
          >
            <LayoutDashboard size={17} className="text-blue-400" />

            <span className="hidden text-sm font-medium text-slate-300 sm:block">
              Dashboard
            </span>
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Profile Header */}
          <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-blue-600/10">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <CircleUserRound size={42} className="text-blue-400" />
                    )}
                  </div>

                  {/* Camera Button */}
                  <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-slate-900 bg-blue-600 text-white transition hover:bg-blue-500">
                    <Camera size={16} />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {doctor.name}
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    {doctor.specialization}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {doctor.qualification}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <button
                type="button"
                onClick={handleAvailability}
                className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  formData.available
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    formData.available ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />

                {formData.available ? "Available" : "Unavailable"}
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-600">
              Click the camera icon to change your profile image.
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Personal Information */}
              <div className="xl:col-span-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <UserRound size={20} className="text-blue-400" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">
                        Personal Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Your basic contact information
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Full Name
                      </label>

                      <div className="relative">
                        <UserRound
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Email
                      </label>

                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="email"
                          value={doctor.email || ""}
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm text-slate-500 outline-none"
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-600">
                        Email cannot be changed here.
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Phone Number
                      </label>

                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Location
                      </label>

                      <div className="relative">
                        <MapPin
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                      <BriefcaseMedical size={20} className="text-purple-400" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">
                        Professional Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Your medical qualifications and fees
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Specialization */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Specialization
                      </label>

                      <div className="relative">
                        <Stethoscope
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="e.g. Cardiologist"
                        />
                      </div>
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Qualification
                      </label>

                      <div className="relative">
                        <GraduationCap
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="e.g. MBBS, MD"
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Experience
                      </label>

                      <div className="relative">
                        <BriefcaseMedical
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="number"
                          min="0"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="Years"
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                          years
                        </span>
                      </div>
                    </div>

                    {/* Consultation Fee */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Consultation Fee
                      </label>

                      <div className="relative">
                        <IndianRupee
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="number"
                          min="0"
                          name="consultationFee"
                          value={formData.consultationFee}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                          placeholder="Enter fee"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                      <FileText size={20} className="text-amber-400" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">About</h2>

                      <p className="text-xs text-slate-500">
                        Tell patients about your professional experience
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows="5"
                    maxLength="1000"
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    placeholder="Write something about your experience, expertise and medical practice..."
                  />

                  <p className="mt-2 text-right text-xs text-slate-600">
                    {formData.about.length}/1000
                  </p>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-6">
                {/* Availability */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Power size={20} className="text-emerald-400" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">Availability</h2>

                      <p className="text-xs text-slate-500">
                        Control your availability
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAvailability}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${
                      formData.available
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-red-500/20 bg-red-500/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          formData.available ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />

                      <div className="text-left">
                        <p
                          className={`text-sm font-medium ${
                            formData.available
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {formData.available ? "Available" : "Unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formData.available
                            ? "Patients can book appointments"
                            : "Patients cannot book appointments"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`h-6 w-11 rounded-full p-1 transition ${
                        formData.available ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition ${
                          formData.available ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Account Information */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <CheckCircle2 size={20} className="text-blue-400" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-white">
                        Account Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Your MediCare account
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">Role</span>

                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium capitalize text-blue-400">
                        {doctor.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">Account</span>

                      <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm text-slate-500">Email</span>

                      <span className="max-w-[180px] break-all text-right text-xs text-slate-400">
                        {doctor.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                      <CheckCircle2 size={18} className="text-amber-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Profile Security
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Your email and password cannot be changed from this
                        page. Password management will be handled separately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="py-8 text-center">
            <p className="text-xs text-slate-600">MediCare Doctor Portal</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
