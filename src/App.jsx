import { useState } from "react";
import LoginPage from "./Pages/LoginPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <LoginPage />
    </div>
  );
}

export default App;
