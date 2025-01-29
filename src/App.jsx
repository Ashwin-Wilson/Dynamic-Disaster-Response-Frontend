import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UserPage from "./Pages/UserPage";
import AdminPage from "./Pages/AdminPage";
import WelcomePage from "./Pages/WelcomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <WelcomePage />
    </div>
  );
}

export default App;
