import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { WeatherProvider } from "./context/WeatherProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </BrowserRouter>
);
