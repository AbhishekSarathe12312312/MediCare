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
} from "lucide-react";
import { toast } from "react-toastify";

const PatientProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
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
      }
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

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

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/profile-update`,
        {
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth || null,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setUser(response.data.user);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        setIsEditing(false);

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <p className="text-sm text-slate-500">Patient Portal</p>

            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {/* Profile Header */}
          <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 to-transparent p-6 sm:p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="h-10 w-10 text-cyan-400" />
                )}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user.name}</h2>

                <p className="mt-1 text-sm text-slate-400">{user.email}</p>

                <span className="mt-3 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium capitalize text-cyan-400">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-6 sm:p-8">
            {!isEditing ? (
              <>
                <h3 className="mb-5 text-lg font-semibold">
                  Personal Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <UserRound className="h-4 w-4" />
                      <span className="text-xs">Full Name</span>
                    </div>

                    <p className="font-medium">{user.name}</p>
                  </div>

                  {/* Email */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">Email Address</span>
                    </div>

                    <p className="break-all font-medium">{user.email}</p>
                  </div>

                  {/* Phone */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Phone className="h-4 w-4" />
                      <span className="text-xs">Phone Number</span>
                    </div>

                    <p className="font-medium">{user.phone}</p>
                  </div>

                  {/* Gender */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <UserRound className="h-4 w-4" />
                      <span className="text-xs">Gender</span>
                    </div>

                    <p className="font-medium capitalize">
                      {user.gender || "Not provided"}
                    </p>
                  </div>

                  {/* DOB */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-xs">Date of Birth</span>
                    </div>

                    <p className="font-medium">
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs">Address</span>
                    </div>

                    <p className="font-medium">
                      {user.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleEdit}
                    className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              /* Edit Form */
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Edit Profile</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Update your personal information
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-500"
                    />

                    <p className="mt-1 text-xs text-slate-600">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                    >
                      <option value="">Select gender</option>

                      <option value="male">Male</option>

                      <option value="female">Female</option>

                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
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
