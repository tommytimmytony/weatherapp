import { useEffect, useState } from "react";
import { useWeather } from "../context/WeatherContext.js";
import { toast } from "sonner";
import { supabase } from "../client.js";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const { user } = useWeather();
  const navigate = useNavigate();

  const handleCurPass = (e) => {
    setCurPass(e.target.value);
  };
  const handleNewPass = (e) => {
    setNewPass(e.target.value);
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase
        .from("user")
        .update({
          password: newPass,
        })
        .eq("email", user.email)
        .eq("username", user.username);

      if (error) {
        console.error("Update failed:", error.message);
        toast.error("Could not update password. Something wrong with server.");
      } else {
        toast.success("Password updated successfully");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: foundUser, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", user.username)
        .eq("password", curPass)
        .single();

      if (error || !foundUser) {
        toast.error("Wrong Password. Please try again!");
      } else {
        handleChangePassword();
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="border border-gray-700 shadow-xl rounded-xl w-96 bg-gray-900/50 backdrop-blur-md p-8 -translate-y-24">
        <h1 className="text-3xl font-semibold text-cyberYellow mb-6">
          Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="text-electricBlue block mb-2">Name</label>
            {user ? user.username : ""}
          </div>
          {/* Code Input */}
          <div>
            <label className="text-electricBlue block mb-2">
              Change Password
            </label>
            <div className="grid gap-y-4">
              <input
                name="input"
                value={curPass}
                onChange={handleCurPass}
                className="w-full rounded-lg px-4 py-2 bg-metallicSilver/20 text-metallicSilver shadow-lg outline-none focus:border-neonPink focus:border-2"
                placeholder="Current Password"
              />
              <input
                name="input"
                value={newPass}
                onChange={handleNewPass}
                className="w-full rounded-lg px-4 py-2 bg-metallicSilver/20 text-metallicSilver shadow-lg outline-none focus:border-neonPink focus:border-2"
                placeholder="New Password"
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-electricBlue text-darkCharcoal rounded-lg px-4 py-2 mt-6 shadow-md hover:bg-cyberYellow/80 hover:scale-105 duration-300"
          >
            Change
          </button>
        </form>
      </div>
    </div>
  );
}
