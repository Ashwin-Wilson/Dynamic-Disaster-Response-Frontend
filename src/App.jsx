import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import WelcomePage from "./Pages/WelcomePage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* <WelcomePage /> */}
      <AdminDashboard />
    </div>
  );
}

export default App;
