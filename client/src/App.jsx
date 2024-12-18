import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "./styles/DashBoard.css";
//Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import Radar from "./pages/Radar";
import Profile from "./pages/Profile";
import { Toaster } from "sonner";
//Layouts
import RootLayout from "./Layouts/RootLayout";
import NavigationBar from "./components/NavigationBar";

// const router = createBrowserRouter(createRoutesFromElements());

export default function App() {
  const location = useLocation();

  const isLoginSignup =
    location.pathname === "/login" || location.pathname === "/signup";
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {isLoginSignup ? (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/radar" element={<Radar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white mb">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/radar" element={<Radar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile/>}/>
          </Routes>
        </div>
      )}
    </>
  );
}
