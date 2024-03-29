import React, { useState } from "react";
import { useUserInfo } from "../../../contexts/userInfo";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const apiUrl = process.env.API_URL;
const TopBar = () => {
  const { userDetails, setUserDeatils } = useUserInfo();

  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();

  const handleLogOut = async () => {
    try {
      setLoggingOut(true);
      const response = await axios.get(`${apiUrl}/api/user/logout`, {
        withCredentials: true,
      });

      setUserDeatils(null);
      setLoggingOut(false);
      router.push("/");
      Cookies.remove("loggedIn");
    } catch (err) {
      console.log(err);

      setLoggingOut(false);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-between text-center items-center bg-gray-900 text-white p-4 fixed w-full z-30">
      <div></div>
      <div className="flex items-center">
        Welcome {userDetails?.name} to the admin dashboard !
      </div>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        onClick={handleLogOut}
      >
        {loggingOut ? "Logging Out.." : "Logout"}
      </button>
    </div>
  );
};

export default TopBar;
