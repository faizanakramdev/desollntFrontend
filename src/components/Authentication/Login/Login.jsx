"use client";
import api from "@/config/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { toast } from "react-toastify";

const Login = () => {
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSigninChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSignin = async (e) => {
    e.preventDefault();

    if (!values?.email) {
      toast.info("Enter your email.");
    } else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values?.email
      )
    ) {
      toast.error("Invalid Email.");
    } else if (!values?.password) {
      toast.info("Enter your password.");
    } else if (values?.password?.length < 8) {
      toast.error("Password should be at least 8 characters long.");
    } else {
      setLoader(true);
      const payload = {
        email: values?.email,
        password: values?.password,
      };

      await axios
        .post(api?.auth?.login, payload)
        .then((response) => {
          setLoader(false);
          toast.success("Success. You are logged in.");
          sessionStorage?.setItem(
            "Login",
            JSON.stringify(response?.data?.login)
          );
          setValues({
            email: "",
            password: "",
          });
          router.push("/add-cars");
        })
        .catch((err) => {
          const error = err?.response;
          setLoader(false);
          toast.error(`${error?.status} ${error?.data?.message}`);
        });
    }
  };
  return (
    <>
      {loader ? (
        <div className="flex flex-row gap-2 w-full h-screen justify-center items-center">
          <div className="w-4 h-4 rounded-full bg-cyan-600 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-cyan-600 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-cyan-600 animate-bounce [animation-delay:.7s]"></div>
        </div>
      ) : (
        <div className="h-svh flex items-center">
          <div className="relative flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md max-w-sm m-auto w-full ">
            <h3 className="block font-sans text-5xl text-center font-semibold text-cyan-600">
              Login In
            </h3>
            <div className="flex flex-col gap-4 p-6">
              <div className="relative w-full min-w-[200px]">
                <input
                  name="email"
                  value={values?.email}
                  onChange={handleSigninChange}
                  placeholder=""
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-xl font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-base peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Email
                </label>
              </div>
              <div className="relative w-full min-w-[200px]">
                <input
                  name="password"
                  value={values?.password}
                  onChange={handleSigninChange}
                  placeholder=""
                  type={showPassword ? "text" : "password"}
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-xl font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-base peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <IoMdEyeOff size={30} />
                  ) : (
                    <IoMdEye size={30} />
                  )}
                </button>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={handleSignin}
                type="button"
                className="block w-full select-none rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-center align-middle font-sans text-md font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Login In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
