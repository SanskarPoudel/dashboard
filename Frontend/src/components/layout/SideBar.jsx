import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUserInfo } from "../../../contexts/userInfo";

const SideBar = () => {
  const { featuresAccess } = useUserInfo();

  const finalFeatures = featuresAccess?.map((feat) => feat.feature);

  const router = useRouter();
  const navigation = [
    { name: "Home", href: "/dashboard" },
    finalFeatures?.includes("admin") && {
      name: "Features",
      subName: "( admin only )",
      href: "/features",
    },
    finalFeatures?.includes("admin") && {
      name: "Roles",
      subName: "( admin only )",
      href: "/roles",
    },
    finalFeatures?.includes("admin") && {
      name: "Users",
      subName: "( admin only )",
      href: "/users",
    },
  ].filter(Boolean);
  return (
    <aside
      className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-full transform transition-transform duration-300 ease-in-out`}
      style={{ top: "4rem" }}
    >
      <nav className="p-5 space-y-4">
        {navigation.map((item) => (
          <Link href={item.href} key={item.name} passHref>
            <div
              className={`cursor-pointer block py-2 px-4 hover:bg-gray-600 rounded-lg ${
                router.pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              {item.name}{" "}
              {item.subName && (
                <span className="text-xs text-gray-400"> {item.subName}</span>
              )}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
