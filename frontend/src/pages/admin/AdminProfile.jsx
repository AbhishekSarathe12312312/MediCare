import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ================= GET ADMIN PROFILE =================
  const getAdminProfile = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );

      if (data.success) {
        setFormData({
          name: data.admin.name || "",
          email: data.admin.email || "",
        });

        setProfileImage(data.admin.profileImage || "");

        sessionStorage.setItem("user", JSON.stringify(data.admin));
        window.dispatchEvent(new Event("authChanged"));
      }
    } catch (error) {
      console.error("GET ADMIN PROFILE ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to load admin profile",
      );
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // ================= UPDATE PROFILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const dataToSend = new FormData();

      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);

      if (selectedImage) {
        dataToSend.append("file", selectedImage);
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/profile-update`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );

      if (data.success) {
        setFormData({
          name: data.admin.name || "",
          email: data.admin.email || "",
        });

        setProfileImage(data.admin.profileImage || "");
        setSelectedImage(null);

        sessionStorage.setItem("user", JSON.stringify(data.admin));
        window.dispatchEvent(new Event("authChanged"));

        toast.success(data.message || "Profile updated successfully");

        setEditing(false);
      }
    } catch (error) {
      console.error("UPDATE ADMIN PROFILE ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <main className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-cyan-500/10 bg-[#0b1728]/80 backdrop-blur-md px-5 pb-6 pt-5 shadow-xl shadow-cyan-500/5 sm:px-8"
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="absolute left-4 top-4 rounded-xl border border-cyan-500/10 bg-[#07111f] px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="mb-6 pt-6 text-center">
            <h1 className="text-lg font-bold text-cyan-400 tracking-wide">
              MediCare
            </h1>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Admin Profile
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Manage your admin account information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[160px_1fr]">
            {/* Profile Image */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-500/30 bg-cyan-500/10 shadow-md">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Admin Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-cyan-400">
                      {formData.name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  )}
                </div>

                {editing && (
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-gray-950 shadow-lg transition hover:bg-cyan-400">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {editing && (
                <p className="mt-2 text-xs text-gray-400">Change photo</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-[#07111f] border border-cyan-500/10 rounded-2xl p-5 shadow-inner">
              <h3 className="mb-4 text-base font-semibold text-white">
                Personal Information
              </h3>

              <div className="grid gap-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-xl border border-cyan-500/10 bg-[#0b1728] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:text-gray-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-cyan-500/10 bg-[#0b1728] px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setSelectedImage(null);
                    getAdminProfile();
                  }}
                  className="w-1/2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-cyan-500/20"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminProfile;
