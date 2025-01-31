import "./App.css";
import WelcomePage from "./Pages/WelcomePage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import FamilyDashboard from "./Pages/family/FamilyDashboard";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/family-dashboard" element={<FamilyDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
