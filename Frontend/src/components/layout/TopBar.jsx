// components/TopBar.js
import React, { useState } from "react";
import { useUserInfo } from "../../../contexts/userInfo";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;
const TopBar = ({ setIsOpen, isOpen }) => {
  const { userDetails } = useUserInfo();

  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const handleLogOut = async () => {
    try {
      setLoggingOut(true);

      const response = await axios.get(`${apiUrl}/api/user/logout`, {
        withCredentials: true,
      });

      Cookies.remove("loggedIn");
      router.push("/");
    } catch (err) {
      toast.error("Failed to Log In");
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-900 text-white p-4 fixed w-full z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg"
      >
        {isOpen ? "Close Menu" : "Open Menu"}
      </button>
      <span>Welcome {userDetails.name} to the admin dashboard !</span>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </div>
  );
};

export default TopBar;
