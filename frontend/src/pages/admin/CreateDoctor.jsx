import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Stethoscope,
  User,
  Mail,
  Phone,
  Lock,
  BriefcaseMedical,
  GraduationCap,
  IndianRupee,
  MapPin,
  FileText,
  ImagePlus,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const CreateDoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    location: "Bhopal",
    about: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.specialization ||
      !formData.qualification ||
      formData.experience === "" ||
      formData.consultationFee === ""
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // Get admin token
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        toast.error("Admin authentication required");
        navigate("/admin/login");
        return;
      }

      // Create FormData
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Add profile image
      if (profileImage) {
        data.append("file", profileImage);
      }

      const response = await axios.post(
        "http://localhost:8000/api/doctor/create-doctor",
        data,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Doctor account created successfully");

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          specialization: "",
          qualification: "",
          experience: "",
          consultationFee: "",
          location: "Bhopal",
          about: "",
        });

        setProfileImage(null);

        setTimeout(() => {
          navigate("/doctor/login");
        }, 800);
      }
    } catch (error) {
      console.error("CREATE DOCTOR ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        toast.error("Admin session expired. Please login again.");

        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 403) {
        toast.error("Access denied. Admin only.");
        return;
      }

      toast.error(
        error.response?.data?.message || "Unable to create doctor account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Stethoscope size={24} className="text-blue-500" />

              <h1 className="text-2xl font-bold text-white">Create Doctor</h1>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Create a doctor account for MediCare
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="mb-5 text-lg font-semibold text-white">
                Basic Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Doctor Name *
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address *
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone Number *
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password *
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Profile Image
                  </label>

                  <div className="relative">
                    <ImagePlus
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-slate-300 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500"
                    />
                  </div>

                  {profileImage && (
                    <p className="mt-2 text-xs text-slate-500">
                      Selected: {profileImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-8 border-t border-slate-800 pt-8">
              <h2 className="mb-5 text-lg font-semibold text-white">
                Professional Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Specialization */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Specialization *
                  </label>

                  <div className="relative">
                    <BriefcaseMedical
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Cardiologist"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Qualification *
                  </label>

                  <div className="relative">
                    <GraduationCap
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="MBBS, MD"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Experience (Years) *
                  </label>

                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="8"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Consultation Fee *
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="number"
                      name="consultationFee"
                      min="0"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      placeholder="800"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Bhopal"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* About */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    About Doctor
                  </label>

                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-slate-500"
                    />

                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Write a short description about the doctor..."
                      className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end border-t border-slate-800 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Doctor..." : "Create Doctor Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDoctor;
