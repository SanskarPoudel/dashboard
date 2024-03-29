import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserInfoContext = createContext();
const apiUrl = process.env.API_URL;
export const UserInfoProvider = ({ children }) => {
  const [featuresAccess, setFeaturesAccess] = useState([]);
  const [userDetails, setUserDeatils] = useState(null);
  const router = useRouter();
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/details`, {
        withCredentials: true,
      });

      const allDetails = response.data.details;

      const allFeatures = allDetails.Role.Features.filter((rf) => {
        return rf.active === true && rf.RoleFeature.enabled === true;
      }).map((rf2) => {
        const featureName = rf2.feature_name;
        const access = rf2.RoleFeature.access;

        return {
          feature: featureName,
          access: access,
        };
      });

      setFeaturesAccess(allFeatures);
      setUserDeatils({
        id: allDetails.id,
        roleName: allDetails.Role.role_name,
        name: allDetails.first_name + " " + allDetails.last_name,
        roleId: allDetails.role_id,
        email: allDetails.email,
        joinedAt: allDetails.createdAt,
      });
    } catch (err) {
      toast.error("Login To Continue");
      router.push("/");
    }
  };

  const loggedInCookie = Cookies.get("loggedIn");

  useEffect(() => {
    fetchUserDetails();
  }, [loggedInCookie]);

  return (
    <UserInfoContext.Provider value={{ featuresAccess, userDetails }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};
