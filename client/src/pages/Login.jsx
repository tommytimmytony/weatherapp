import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillPersonFill, BsFillKeyFill } from "react-icons/bs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import background from "../assets/weather1.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../client.js";
import { useWeather } from "../context/WeatherContext.js";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useWeather();
  const [isSaving, setIsSaving] = useState(false);

  const schema = yup.object().shape({
    username: yup.string().required("Please enter your username"),
    password: yup.string().required("Please enter your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Single query to find user by username and password
      const { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", data.username)
        .eq("password", data.password)
        .single(); // Ensures we get only one result

      if (error || !user) {
        // Show an error if no user is found
        toast.error("Wrong Username or Password");
      } else {
        // Redirect to dashboard if login is successful
        loginUser(user.id, user.email, user.username);
        navigate("/");
        reset();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
    setIsSaving(false);
  };

  return (
    <main
      className={`h-lvh w-full bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-30`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="grid place-items-center h-full">
        <div className="border border-metallicSilver shadow-2xl rounded-xl h-[28rem] lg:w-[30rem] w-[22rem] bg-darkCharcoal/55 backdrop-blur-md">
          <form
            className="w-full h-full flex flex-col items-start justify-center py-5 lg:px-10 px-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-2xl font-bold text-cyberYellow self-center">
              Log In
            </h1>
            <label className="text-electricBlue mb-2 mt-8">Username</label>
            <div className="relative w-full">
              <input
                {...register("username")}
                className="w-full rounded-lg h-9 px-2 pl-8 pb-1 bg-metallicSilver/20 text-metallicSilver shadow-lg outline-none focus:border-neonPink focus:border-2"
              />
              <BsFillPersonFill className="text-lg text-electricBlue absolute top-2 left-2" />
            </div>
            <p className="text-sm text-neonPink font-semibold mt-1">
              {errors.username?.message}
            </p>
            <label className="text-electricBlue mb-2 mt-10">Password</label>
            <div className="relative w-full">
              <input
                type="password"
                {...register("password")}
                className="w-full rounded-lg h-9 px-2 pl-8 pb-1 bg-metallicSilver/20 text-metallicSilver shadow-lg outline-none focus:border-neonPink focus:border-2"
              />
              <BsFillKeyFill className="text-lg text-electricBlue absolute top-2 left-2" />
            </div>
            <p className="text-sm text-neonPink font-semibold mt-1">
              {errors.password?.message}
            </p>
            <button
              type="submit"
              disabled={isSaving}
              className="self-center bg-electricBlue text-darkCharcoal rounded-lg px-6 py-2.5 mt-8 shadow-md hover:bg-cyberYellow/80 hover:scale-105 duration-300"
            >
              {isSaving ? "Loading..." : "Login"}
            </button>
            <a
              href="/sign-up"
              className="self-center text-slate-300 rounded-lg px-6 py-2.5 mt-8 hover:bg-red-600 hover:scale-105 duration-300"
            >
              {" "}
              Signup{" "}
            </a>
          </form>
        </div>
      </div>
    </main>
  );
}
