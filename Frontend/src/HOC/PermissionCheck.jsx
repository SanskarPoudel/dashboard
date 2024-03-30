import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserInfo } from "../contexts/userInfo";

const withPermissions = (WrappedComponent, requiredPermissions) => {
  return function WithPermissions(props) {
    const { featuresAccess, loadingInfo } = useUserInfo();

    const router = useRouter();

    // const hasRequiredAccess = (userAccess, requiredAccess) => {
    //   if (userAccess === requiredAccess) return true;
    //   if (requiredAccess === "read" && userAccess === "write") return true;
    //   return false;
    // };

    const isAdmin = featuresAccess?.some(
      (feature) => feature.feature === "admin"
    );

    const hasPermission =
      isAdmin ||
      requiredPermissions.every((requiredPermission) =>
        featuresAccess?.some(
          (userFeature) => userFeature.feature === requiredPermission
          // hasRequiredAccess(userFeature.access, requiredPermission.access)
        )
      );

    useEffect(() => {
      if (loadingInfo === false && !hasPermission) {
        router.push("/");
      }
    }, [hasPermission, router, loadingInfo]);

    if (hasPermission) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withPermissions;
