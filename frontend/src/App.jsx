import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/auth/PatientRegister";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Login from "./pages/auth/Login";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import FindDoctors from "./pages/patient/FindDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import Appointments from "./pages/patient/Appointments";

import DoctorRegister from "./pages/doctor/DoctorRegister";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorPatients from "./pages/doctor/DoctorPatients";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePatients from "./pages/admin/ManagePatients";
import ManageAppointments from "./pages/admin/ManageAppointments";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminEditDoctor from "./pages/admin/AdminEditDoctor";
import AdminProfile from "./pages/admin/AdminProfile";

import Home from "./pages/common/Home";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Services from "./pages/common/Services";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientRegister from "./pages/auth/PatientRegister";

const AppContent = () => {
  const location = useLocation();

  const hideNavbar = [
    "/login",
    "/verify-otp",
    "/patient/register",
    "/doctor/register",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* publically accessible */}
        <Route path="/find-doctors" element={<FindDoctors />} />

        {/* ================= PATIENT AUTH ================= */}

        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />

        {/* ================= PATIENT ================= */}

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute role="patient">
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute role="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/book-appointment/:doctorId"
          element={
            <ProtectedRoute role="patient">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        {/* ================= DOCTOR ================= */}

        <Route path="/doctor/register" element={<DoctorRegister />} />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute role="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute role="doctor">
              <DoctorPatients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute role="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="admin">
              <AdminDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute role="admin">
              <ManagePatients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="admin">
              <ManageAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors/edit/:doctorId"
          element={
            <ProtectedRoute role="admin">
              <AdminEditDoctor />
            </ProtectedRoute>
          }
        />

        {/* ================= COMMON ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
