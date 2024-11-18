import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillKeyFill, BsEnvelopeFill } from "react-icons/bs";
import background from "../assets/weather3.jpg";
import { supabase } from "../client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Please enter your email"),
  username: yup.string().required("Please enter your username"),
  password: yup.string().required("Please enter your password"),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data) => {
    console.log(data)
    const { error } = await supabase.from("user").insert([
      {
        email: data.email,
        username: data.username,
        password: data.password,
      },
    ]);
    if (error) {
      console.error("Insert failed:", error.message);
      toast.error("Username or email already exists. Please Login.");
    } else {
      toast.success("Created account successfully");
      reset(); // Clear form only if the insertion was successful
      navigate("/");
    }
  };

  return (
    <main
      className={`h-lvh w-full bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-30`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="grid place-items-center h-full">
        <div className="border border-metallicSilver shadow-2xl rounded-xl h-[35rem] lg:w-[30rem] w-[22rem] bg-darkCharcoal/50 backdrop-blur-md">
          <form
            className="w-full h-full flex flex-col items-start justify-center py-5 lg:px-10 px-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-2xl font-bold text-cyberYellow self-center">
              Sign Up
            </h1>

            {/* Email Field */}
            <label className="text-electricBlue mb-2 mt-8">Email</label>
            <div className="relative w-full">
              <input
                {...register("email")}
                className="w-full rounded-lg h-9 px-2 pl-8 pb-1 bg-darkCharcoal text-metallicSilver border border-electricBlue shadow-lg outline-none focus:border-neonPink focus:border-2"
              />
              <BsEnvelopeFill className="text-lg text-electricBlue absolute top-2 left-2" />
            </div>
            <p className="text-sm text-neonPink font-semibold mt-1">
              {errors.email?.message}
            </p>

            {/* Username Field */}
            <label className="text-electricBlue mb-2 mt-8">Username</label>
            <div className="relative w-full">
              <input
                {...register("username")}
                className="w-full rounded-lg h-9 px-2 pl-8 pb-1 bg-darkCharcoal text-metallicSilver border border-electricBlue shadow-lg outline-none focus:border-neonPink focus:border-2"
              />
              <BsFillPersonFill className="text-lg text-electricBlue absolute top-2 left-2" />
            </div>
            <p className="text-sm text-neonPink font-semibold mt-1">
              {errors.username?.message}
            </p>

            {/* Password Field */}
            <label className="text-electricBlue mb-2 mt-10">Password</label>
            <div className="relative w-full">
              <input
                type="password"
                {...register("password")}
                className="w-full rounded-lg h-9 px-2 pl-8 pb-1 bg-darkCharcoal text-metallicSilver border border-electricBlue shadow-lg outline-none focus:border-neonPink focus:border-2"
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
              {isSaving ? "Loading..." : "Submit"}
            </button>
            <a
              href="/login"
              className="self-center text-slate-300 rounded-lg px-6 py-2.5 mt-8 hover:bg-red-600 hover:scale-105 duration-300"
            >
              {" "}
              Login{" "}
            </a>
          </form>
        </div>
      </div>
    </main>
  );
}
