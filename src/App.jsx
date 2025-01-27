import { useState } from "react";
import LoginPage from "./Pages/LoginPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UserPage from "./Pages/UserPage";
import AdminPage from "./Pages/AdminPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <AdminPage />
    </div>
  );
}

export default App;
