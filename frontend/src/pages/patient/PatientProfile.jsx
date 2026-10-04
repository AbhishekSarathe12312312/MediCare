import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
  Save,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";

const PatientProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });

  // ================= GET PROFILE =================
  const getProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/patient/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const profile = response.data.user;

        setUser(profile);

        setFormData({
          name: profile.name || "",
          phone: profile.phone || "",
          gender: profile.gender || "",
          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          address: profile.address || "",
        });

        // Keep latest profile in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(profile));

        // Sync Navbar
        window.dispatchEvent(new Event("authChanged"));
      }
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD PROFILE =================
  useEffect(() => {
    getProfile();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      e.target.value = "";
      return;
    }

    setProfileImage(file);
  };

  // ================= EDIT =================
  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      address: user.address || "",
    });

    setProfileImage(null);
    setIsEditing(true);
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      address: user.address || "",
    });

    setProfileImage(null);
    setIsEditing(false);
  };

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setSaving(true);

      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("gender", formData.gender);
      data.append("dateOfBirth", formData.dateOfBirth || "");
      data.append("address", formData.address.trim());

      // IMPORTANT:
      // Multer backend uses .single("file")
      if (profileImage) {
        data.append("file", profileImage);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/patient/profile-update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const updatedUser = response.data.user;

        // Update UI
        setUser(updatedUser);

        // Update sessionStorage
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        // Update Navbar immediately
        window.dispatchEvent(new Event("authChanged"));

        // Reset edit state
        setProfileImage(null);
        setIsEditing(false);

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 pt-16">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400" />
          <p className="mt-4 text-sm font-medium text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8 lg:px-12 pt-16 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-5xl">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-950/30">
          {/* Back Button */}
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="absolute left-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 text-slate-400 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-slate-900 hover:text-white cursor-pointer shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Profile Details Header */}
          <div className="border-b border-slate-800/80 bg-gradient-to-r from-cyan-500/10 via-slate-900/40 to-slate-900/40 px-6 pb-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* User Details */}
              <div className="flex items-center gap-4 pl-0 sm:pl-12">
                {/* Profile Image */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-500/10 shadow-inner">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-8 w-8 text-cyan-400" />
                  )}
                </div>

                {/* Name, Email, Role */}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-white truncate">
                    {user.name}
                  </h1>

                  <p className="mt-0.5 text-xs font-medium text-slate-400 truncate">
                    {user.email}
                  </p>

                  <span className="mt-2 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold capitalize text-cyan-400 shadow-sm">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400 hover:shadow-cyan-400/40 active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {!isEditing ? (
              <>
                {/* Information Header */}
                <div className="mb-6">
                  <h3 className="text-base font-bold text-white">
                    Personal Information
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Your account and personal details overview
                  </p>
                </div>

                {/* Information Grid */}
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  {/* Name */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2 text-slate-400 font-medium">
                      <UserRound className="h-4 w-4 text-cyan-400" />
                      <span>Full Name</span>
                    </div>

                    <p className="text-sm font-semibold text-white">
                      {user.name || "Not provided"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2 text-slate-400 font-medium">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <span>Email Address</span>
                    </div>

                    <p className="break-all text-sm font-semibold text-white">
                      {user.email || "Not provided"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2 text-slate-400 font-medium">
                      <Phone className="h-4 w-4 text-cyan-400" />
                      <span>Phone Number</span>
                    </div>

                    <p className="text-sm font-semibold text-white">
                      {user.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2 text-slate-400 font-medium">
                      <UserRound className="h-4 w-4 text-cyan-400" />
                      <span>Gender</span>
                    </div>

                    <p className="text-sm font-semibold capitalize text-white">
                      {user.gender || "Not provided"}
                    </p>
                  </div>

                  {/* Date of Birth */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2 text-slate-400 font-medium">
                      <CalendarDays className="h-4 w-4 text-cyan-400" />
                      <span>Date of Birth</span>
                    </div>

                    <p className="text-sm font-semibold text-white">
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700">
                    <div className="mb-2 flex items-center gap-2 text-slate-400 font-medium">
                      <MapPin className="h-4 w-4 text-cyan-400" />
                      <span>Address</span>
                    </div>

                    <p className="text-sm font-semibold text-white truncate">
                      {user.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Edit Form */
              <form onSubmit={handleUpdateProfile} className="text-xs">
                {/* Edit Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Edit Profile
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Update your personal information below
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Profile Image */}
                <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4">
                  <label className="mb-2 block font-medium text-slate-300">
                    Profile Image
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-500/10 shadow-inner">
                      {profileImage ? (
                        <img
                          src={URL.createObjectURL(profileImage)}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound className="h-7 w-7 text-cyan-400" />
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-cyan-400 file:cursor-pointer transition"
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    JPG, PNG or WEBP. Maximum size 5 MB.
                  </p>
                </div>

                {/* Form Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-300">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-300">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-500"
                    />

                    <p className="mt-1 text-[10px] text-slate-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-300">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-300">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-white outline-none transition focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
                    >
                      <option value="" className="bg-slate-950">
                        Select gender
                      </option>
                      <option value="male" className="bg-slate-950">
                        Male
                      </option>
                      <option value="female" className="bg-slate-950">
                        Female
                      </option>
                      <option value="other" className="bg-slate-950">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-300">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-white outline-none transition focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-300">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3 border-t border-slate-800/80 pt-5">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold tracking-wide text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:bg-cyan-400 hover:shadow-cyan-400/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
