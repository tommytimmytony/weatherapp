import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

//Components
import NavigationBar from "../components/NavigationBar";

export default function RootLayout() {
  const location = useLocation();

  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    console.log("Location: ", location);
    //Only Show Navigation bar on non login and signup pages
    if (location.pathname === "/login" || location.pathname === "/sign-up") {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white mb">
      <Toaster position="top-right" richColors closeButton />
      {showNavbar && <NavigationBar />}
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}
