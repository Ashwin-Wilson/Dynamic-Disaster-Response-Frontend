import "./App.css";
import WelcomePage from "./Pages/WelcomePage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import FamilyDashboard from "./Pages/family/FamilyDashboard";

import FamilySignUp from "./Pages/family/FamilySignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import AdminSignup from "./Pages/Admin/AdminSignup";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/family/signup" element={<FamilySignUp />} />
          <Route path="/family/dashboard" element={<FamilyDashboard />} />
          <Route path="/Admin/login" element={<AdminLoginPage />} />
          <Route path="/Admin/signup" element={<AdminSignup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
