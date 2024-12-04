import { NavLink, useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { BiSolidLogInCircle } from "react-icons/bi";
import { GiRadarDish } from "react-icons/gi";
import { useWeather } from "../context/WeatherContext";
export default function CustomNavLinks() {
  const navigate = useNavigate();
  const { setCity, user } = useWeather();
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
    <>
      {" "}
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
      {/* Radar */}
      <NavLink
        to="radar"
        className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
      >
        <GiRadarDish size={25} /> &nbsp; Radar
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
            to="profile"
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
    </>
  );
}
