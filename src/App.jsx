import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import WelcomePage from "./Pages/WelcomePage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import FamilyDashboard from "./Pages/family/FamilyDashboard";
import FamilySignUp from "./Pages/family/FamilySignUp";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import AdminSignup from "./Pages/Admin/AdminSignup";
import FamilyLogin from "./Pages/family/FamilyLogin";
import DriverPage from "./Pages/driver/DriverPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/Admin/signup" element={<AdminSignup />} />
          <Route path="/Admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/family/signup" element={<FamilySignUp />} />
          <Route path="/family/login" element={<FamilyLogin />} />
          <Route path="/family/dashboard" element={<FamilyDashboard />} />
          <Route path="/driver/dashboard" element={<DriverPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
