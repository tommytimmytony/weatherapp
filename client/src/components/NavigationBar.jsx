import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//icons
import { FaCloud } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { BiSolidLogInCircle } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { GiRadarDish } from "react-icons/gi";
import { useWeather } from "../context/WeatherContext";

export default function NavigationBar() {
  const navigate = useNavigate();
  const [citySelected, setCitySelected] = useState("");
  const { user, setCity } = useWeather();

  const handleCityChange = (e) => {
    setCitySelected(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && citySelected) {
      setCity(citySelected);
      navigate("/");
      setCitySelected("");
    }
  };

  async function findCurLocation() {
    if ("geolocation" in navigator) {
      // Get current position
      console.log("Getting current location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCity(`${latitude},${longitude}`);
          setCitySelected("");
          navigate("/");
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      alert("Geolocation is not available in this browser.");
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
      {/* Logo */}
      <div className="flex items-center text-2xl font-bold text-gray-100">
        <FaCloud size={50} /> &nbsp; Weather App
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-4 max-w-xs relative">
        <IoIosSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />{" "}
        {/* Icon positioned inside the container */}
        <input
          type="text"
          value={citySelected}
          onChange={(e) => {
            handleCityChange(e);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }} // Listen for the Enter key
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
        />
      </div>

      {/* Current Location Button */}
      <NavLink
        to="/"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
        onClick={() => findCurLocation()}
      >
        <CiLocationOn size={25} /> &nbsp; Current Location
      </NavLink>
      {/* Home */}
      <NavLink
        to="/"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
      >
        <FaHome size={25} /> &nbsp; Home
      </NavLink>
      {/* Login */}
      {user ? (
        <>
          <NavLink
            to="login"
            className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
          >
            <BiSolidLogInCircle size={25} /> &nbsp; Logout
          </NavLink>
          <NavLink
            to="login"
            className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
          >
            <BiSolidLogInCircle size={25} /> &nbsp; Profile
          </NavLink>
        </>
      ) : (
        <NavLink
          to="login"
          className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
        >
          <BiSolidLogInCircle size={25} /> &nbsp; Login
        </NavLink>
      )}
      {/* Profile */}
      <NavLink
        to="radar"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
      >
        <GiRadarDish size={25} /> &nbsp; Radar
      </NavLink>
    </div>
  );
}
