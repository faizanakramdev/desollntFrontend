"use client";
import api from "@/config/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [loader, setLoader] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [values, setValues] = useState({
    carModel: "",
    price: 0,
    phone: "",
    city: "",
    numOfCopies: 1,
    selectedImages: [],
  });
  const router = useRouter();
  const handleChange = (e) => {
    // const { name, value } = e.target;
    const { name, value, files } = e.target;
    if (name === "selectedImages") {
      if (files) {
        const filesArray = Array.from(e.target.files).slice(
          0,
          values?.numOfCopies - values?.selectedImages?.length
        );
        setValues((prevValues) => ({
          ...prevValues,
          selectedImages: [...prevValues.selectedImages, ...filesArray],
        }));
      }
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const handleDeleteImage = (indexToRemove) => {
    setValues((prevValues) => ({
      ...prevValues,
      selectedImages: prevValues.selectedImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };
  const handleAddCar = async (e) => {
    e.preventDefault();

    if (!values?.carModel) {
      toast.info("Enter your Car Model.");
    } else if (values?.carModel?.length < 3) {
      toast.error("Enter valid Model.");
    } else if (!values?.price) {
      toast.info("Enter your Price.");
    } else if (!values?.phone) {
      toast.info("Enter your Phone Number.");
    } else if (values?.phone?.length > 11 || values?.phone?.length < 11) {
      toast.error("Phone Number should be 11 Digits.");
    } else if (!values?.city) {
      toast.info("Enter your City.");
    } else if (values?.selectedImages.length === 0) {
      toast.error("Choice the reference Image.");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("carModel", values.carModel);
      formData.append("price", values.price);
      formData.append("phoneNumber", values.phone);
      formData.append("city", values.city);
      formData.append("maxPictures", values.numOfCopies);

      values.selectedImages.forEach((file, index) => {
        formData.append(`selectedImages`, values.selectedImages[index]);
      });

      await axios
        .post(api?.panel?.cars, formData)
        .then((response) => {
          toast.success(
            "Success! Car details have been successfully recorded."
          );
          setLoader(false);
          setValues({
            carModel: "",
            price: 0,
            phone: "",
            city: "",
            numOfCopies: 1,
            selectedImages: [],
          });
        })
        .catch((err) => {
          setLoader(false);
          const error = err?.response;
          toast.error(`${error?.status} ${error?.data?.message}`);
        });
    }
  };

  useEffect(() => {
    const loginStatus = JSON.parse(sessionStorage.getItem("Login"));

    if (loginStatus) {
      setIsLoggedIn(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };
  const handleLogout = () => {
    sessionStorage.removeItem("Login");
    setIsLoggedIn(false);

    router.push("/");
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
        <>
          {isLoggedIn && (
            <div class="flex flex-col items-center justify-center">
              <div className="self-end pr-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-tr from-cyan-600 to-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
              <section class="rounded-full p-2 bg-white m-auto w-full max-w-2xl">
                <div class="flex items-center justify-center my-3">
                  <div class="xl:mx-2xl shadow-md p-4 xl:w-full  2xl:max-w-2xl">
                    <div class="mb-2"></div>
                    <h2 class="block font-sans text-5xl text-center font-semibold text-cyan-600">
                      Add Car
                    </h2>
                    <p class="mt-2 text-base text-gray-600 text-center">
                      The app facilitates the submission of requests for a car
                      selling service.
                    </p>
                    <form class="mt-5">
                      <div class="space-y-4">
                        <div className="flex items-center gap-2">
                          <label class="text-base font-medium text-gray-900 w-1/5">
                            Car Model:
                          </label>
                          <div class="mt-2 w-4/5">
                            <input
                              placeholder="eg:suzuki"
                              type="text"
                              class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                              name="carModel"
                              value={values?.carModel}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label class="text-base font-medium text-gray-900 w-1/5">
                            Price:
                          </label>
                          <div class="mt-2 w-4/5">
                            <input
                              placeholder="eg:2000000"
                              type="number"
                              class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                              name="price"
                              value={values?.price === 0 ? " " : values?.price}
                              onChange={handleChange}
                              min="0"
                              inputmode="numeric"
                              pattern="\d*"
                              onKeyPress={handleKeyPress}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label class="text-base font-medium text-gray-900 w-1/5">
                            Phone:
                          </label>
                          <div class="mt-2 w-4/5">
                            <input
                              placeholder="03018484652"
                              type="tel"
                              class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                              name="phone"
                              value={values?.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label class="text-base font-medium text-gray-900 w-1/5">
                            City:
                          </label>
                          <div class="mt-2 w-4/5 flex items-center gap-4">
                            <div class="flex items-center ">
                              <input
                                name="city"
                                type="radio"
                                class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                onChange={(e) =>
                                  handleChange({
                                    target: { name: "city", value: "Lahore" },
                                  })
                                }
                              />
                              <label class="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                Lahore
                              </label>
                            </div>
                            <div class="flex items-center ">
                              <input
                                name="city"
                                type="radio"
                                class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                onChange={(e) =>
                                  handleChange({
                                    target: { name: "city", value: "Karachi" },
                                  })
                                }
                              />
                              <label class="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                Karachi
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-base font-medium text-gray-900 w-1/5">
                            No of Pictures:
                          </label>
                          <div className="mt-2 w-4/5">
                            <select
                              id="numOfCopies"
                              onChange={(e) =>
                                handleChange({
                                  target: {
                                    value: e.target.value,
                                    name: "numOfCopies",
                                  },
                                })
                              }
                              className="rounded-md border border-gray-300 bg-transparent text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              {Array.from({ length: 10 }, (_, index) => (
                                <option key={index} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-base font-medium text-gray-900 w-1/5">
                            Images:
                          </label>
                          <div className="mt-2 w-4/5">
                            {values?.selectedImages.length <
                              values?.numOfCopies && (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                multiple
                                className="hidden"
                                id="image-upload"
                                name="selectedImages"
                              />
                            )}
                            {values?.selectedImages.length <
                              values?.numOfCopies && (
                              <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded"
                              >
                                + Add Picture
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-5 flex-wrap">
                          {values?.selectedImages?.map((imageUrl, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(imageUrl)}
                                alt={`Preview ${index}`}
                                className="w-32 h-32 m-1 object-cover"
                              />
                              <p
                                onClick={() => handleDeleteImage(index)}
                                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none cursor-pointer w-8 h-8 flex justify-center items-center"
                              >
                                X
                              </p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <button
                            class="block w-full select-none rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-center align-middle font-sans text-md font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            onClick={handleAddCar}
                          >
                            Add Car
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
