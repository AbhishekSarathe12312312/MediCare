import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePatients from "./pages/admin/ManagePatients";
import ManageAppointments from "./pages/admin/ManageAppointments";
import Home from "./pages/common/Home";
import Navbar from "./components/Navbar";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Services from "./pages/common/Services";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminEditDoctor from "./pages/admin/AdminEditDoctor";
import AdminProfile from "./pages/admin/AdminProfile";

const App = () => {
  return (
    <BrowserRouter>
      {/* components  */}
      <Navbar />

      <Routes>
        {/* patient */}
        <Route path="/patient/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />

        {/* protected routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/find-doctors"
          element={
            <ProtectedRoute role="patient">
              <FindDoctors />
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

        {/* doctor */}
        {/* public route */}
        <Route path="/doctor/register" element={<DoctorRegister />} />
        {/* protected routes */}
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

        {/* admin  */}
        {/* protected */}
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

        {/* common routes  */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
