import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image.png";

const Start = () => {
  return (
    <div>
      <div className="h-screen bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=1600&auto=format&fit=crop&q=80)] bg-cover bg-center w-full flex justify-between pt-8 flex-col">
        <img
          className="w-30 ml-4 md:ml-10 bg-transparent mix-blend-darken object-contain scale-[1.08]"
          src={logo}
          alt="RideX Logo"
        />
        <div className="bg-white py-4 px-4 pb-7 w-full md:max-w-md md:mx-auto md:mb-8 md:rounded-2xl md:shadow-2xl md:p-6">
          <h2 className="text-3xl font-bold">Get Started with RideX</h2>
          <Link
            to="/login"
            className="w-full flex items-center justify-center bg-black text-white py-3 rounded-lg mt-5 font-medium"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
