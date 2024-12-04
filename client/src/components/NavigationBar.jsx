import { useNavigate } from "react-router-dom";
import { useState } from "react";
//icons
import { FaCloud, FaBars, FaTimes } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useWeather } from "../context/WeatherContext";

import NavLinks from "./NavLinks";

export default function NavigationBar() {
  const navigate = useNavigate();
  const [citySelected, setCitySelected] = useState("");
  const { setCity, user } = useWeather();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      <div className={`hidden md:block`}>
        <div className="flex space-x-2">
          <NavLinks />
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <div className="relative md:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-100 focus:outline-none"
        >
          {isDropdownOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
        </button>

        {/* Dropdown Menu */}
        <div
          className={`${
            isDropdownOpen ? "block" : "hidden"
          } absolute right-0 mt-2 w-48 space-y-2 bg-gray-800 shadow-lg rounded-lg z-10`}
        >
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
