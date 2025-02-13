import "./App.css";
import WelcomePage from "./Pages/WelcomePage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import FamilyDashboard from "./Pages/family/FamilyDashboard";

import FamilySignUp from "./Pages/family/FamilySignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage";
import AdminSignup from "./Pages/Admin/AdminSignup";
import FamilyLogin from "./Pages/family/FamilyLogin";
import MapView from "./Components/MapView";
import DriverPage from "./Pages/driver/DriverPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          {/* <Route path="/" element={<MapView />} /> */}

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
