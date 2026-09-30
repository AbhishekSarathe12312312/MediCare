import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Login from "./pages/auth/Login";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import FindDoctors from "./pages/patient/FindDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import Appointments from "./pages/patient/Appointments";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import CreateDoctor from "./pages/admin/CreateDoctor";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import EditDoctor from "./pages/admin/EditDoctor";
import ManagePatients from "./pages/admin/ManagePatients";
import ManageAppointments from "./pages/admin/ManageAppointments";
import Home from "./pages/common/Home";
import Navbar from "./components/Navbar";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Services from "./pages/common/Services";

const App = () => {
  return (
    <BrowserRouter>
      {/* components  */}
      <Navbar />

      {/* routes  */}
      <Routes>
        {/* patient routes  */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/doctors" element={<FindDoctors />} />
        <Route
          path="/patient/book-appointment/:doctorId"
          element={<BookAppointment />}
        />
        <Route path="/patient/appointments" element={<Appointments />} />

        {/* admin  routes */}
        <Route path="/admin/create-doctor" element={<CreateDoctor />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<ManageDoctors />} />
        <Route path="/admin/doctors/edit/:doctorId" element={<EditDoctor />} />
        <Route path="/admin/patients" element={<ManagePatients />} />
        <Route path="/admin/appointments" element={<ManageAppointments />} />

        {/* doctor routes  */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />

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
