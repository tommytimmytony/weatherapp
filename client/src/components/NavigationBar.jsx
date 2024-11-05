import { NavLink } from "react-router-dom";

//icons
import { FaCloud } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { BiSolidLogInCircle } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export default function NavigationBar() {
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
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
        />
      </div>

      {/* Current Location Button */}
      <button className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600">
        <CiLocationOn size={25} /> &nbsp; Current Location
      </button>
      {/* Home */}
      <NavLink
        to="/"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
      >
        <FaHome size={25} /> &nbsp; Home
      </NavLink>
      {/* Login */}
      <NavLink
        to="login"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
      >
        <BiSolidLogInCircle size={25} /> &nbsp; Login
      </NavLink>

      {/* Profile */}
      <NavLink
        to="profile"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
      >
        <CgProfile size={25} /> &nbsp; Profile
      </NavLink>
    </div>
  );
}
