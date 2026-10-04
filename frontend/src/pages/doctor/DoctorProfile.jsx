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
  Loader2,
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
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile(token);
  }, [navigate]);

  const fetchProfile = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/doctor/profile`,
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

        // Keep latest doctor data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(doctorData));
      }
    } catch (error) {
      console.error("FETCH DOCTOR PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        toast.error("Session expired. Please login again.");

        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied");
        navigate("/login");
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

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
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
        `${import.meta.env.VITE_API_URL}/api/doctor/profile-update`,
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

        sessionStorage.setItem("user", JSON.stringify(updatedDoctor));

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("UPDATE DOCTOR PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.dispatchEvent(new Event("authChanged"));
        toast.error("Session expired. Please login again.");

        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));

    toast.success("Logged out successfully");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-10 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-cyan-400 mb-3"
          />
          <p className="text-xs font-medium text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white selection:bg-cyan-500 selection:text-gray-950 mt-16">
      {/* Main Container (No Navbar, No Sidebar) */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Profile Header Banner */}
        <div className="mb-8 rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Image with Camera Upload */}
              <div className="relative">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-sm">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CircleUserRound size={36} />
                  )}
                </div>

                <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500 text-gray-950 transition hover:bg-cyan-400 shadow-md">
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {doctor.name}
                </h2>
                <p className="mt-0.5 text-xs font-semibold text-cyan-400">
                  {doctor.specialization}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {doctor.qualification}
                </p>
              </div>
            </div>

            {/* Availability Toggle Button */}
            <button
              type="button"
              onClick={handleAvailability}
              className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                formData.available
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full animate-pulse ${
                  formData.available ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              {formData.available ? "Available" : "Unavailable"}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Click the camera icon to update your professional profile photo.
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Personal Information & Professional Info */}
            <div className="xl:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Personal Information
                    </h3>
                    <p className="text-xs text-gray-400">
                      Your basic contact details
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 text-xs">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserRound
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-4 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="email"
                        value={doctor.email || ""}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-cyan-500/10 bg-[#07111f]/50 py-3 pl-10 pr-4 text-gray-500 outline-none"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-500">
                      Email address cannot be modified here.
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-4 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-4 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                    <BriefcaseMedical size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Professional Information
                    </h3>
                    <p className="text-xs text-gray-400">
                      Medical background and consultation fees
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 text-xs">
                  {/* Specialization */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Specialization
                    </label>
                    <div className="relative">
                      <Stethoscope
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-4 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="e.g. Cardiologist"
                      />
                    </div>
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Qualification
                    </label>
                    <div className="relative">
                      <GraduationCap
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-4 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="e.g. MBBS, MD"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Experience
                    </label>
                    <div className="relative">
                      <BriefcaseMedical
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        min="0"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-14 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="Years"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                        years
                      </span>
                    </div>
                  </div>

                  {/* Consultation Fee */}
                  <div>
                    <label className="mb-2 block font-medium text-gray-300">
                      Consultation Fee
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        min="0"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-cyan-500/10 bg-[#07111f] py-3 pl-10 pr-4 font-semibold text-white outline-none transition focus:border-cyan-500/40"
                        placeholder="Enter fee"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      About
                    </h3>
                    <p className="text-xs text-gray-400">
                      Summary of your medical practice and expertise
                    </p>
                  </div>
                </div>

                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="5"
                  maxLength="1000"
                  className="w-full resize-none rounded-xl border border-cyan-500/10 bg-[#07111f] p-4 text-xs leading-relaxed text-white outline-none transition focus:border-cyan-500/40"
                  placeholder="Write something about your experience, expertise and medical practice..."
                />

                <p className="mt-2 text-right text-xs font-medium text-gray-500">
                  {formData.about.length}/1000
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-gray-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-950/30 border-t-gray-950" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="space-y-6">
              {/* Availability Toggle Card */}
              <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <Power size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Availability
                    </h3>
                    <p className="text-xs text-gray-400">
                      Toggle appointment booking status
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAvailability}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 transition cursor-pointer ${
                    formData.available
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        formData.available ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <div className="text-left text-xs">
                      <p
                        className={`font-semibold ${
                          formData.available
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {formData.available ? "Available" : "Unavailable"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {formData.available
                          ? "Patients can book appointments"
                          : "Booking is currently paused"}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-6 w-11 rounded-full p-1 transition ${
                      formData.available ? "bg-emerald-500" : "bg-gray-800"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-[#07111f] transition ${
                        formData.available ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Account Information */}
              <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Account Information
                    </h3>
                    <p className="text-xs text-gray-400">
                      MediCare portal status
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                    <span className="font-medium text-gray-400">Role</span>
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 font-semibold capitalize text-cyan-400">
                      {doctor.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                    <span className="font-medium text-gray-400">
                      Account Status
                    </span>
                    <span
                      className={`flex items-center gap-1.5 font-semibold ${
                        doctor.isActive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          doctor.isActive ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      {doctor.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-xl border border-cyan-500/10 bg-[#07111f] p-3.5">
                    <span className="font-medium text-gray-400">
                      Email Address
                    </span>
                    <span className="max-w-[170px] truncate font-semibold text-gray-300">
                      {doctor.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 p-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">
                      Profile Security
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      Credentials and password updates are managed through
                      secured authentication settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs font-medium text-gray-500">
            MediCare Doctor Portal &copy; 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
