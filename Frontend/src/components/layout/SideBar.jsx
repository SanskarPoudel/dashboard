import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUserInfo } from "../../contexts/userInfo";

const SideBar = () => {
  const { featuresAccess } = useUserInfo();

  const finalFeatures = featuresAccess?.map((feat) => feat.feature);

  const router = useRouter();

  const allNavigationItems = [
    { name: "Home", href: "/dashboard", condition: true },
    {
      name: "Features",
      subName: "( admin only )",
      href: "/features",
      condition: finalFeatures?.includes("admin"),
    },
    {
      name: "Roles",
      subName: "( admin only )",
      href: "/roles",
      condition: finalFeatures?.includes("admin"),
    },
    {
      name: "Users",
      subName: "( admin only )",
      href: "/users",
      condition: finalFeatures?.includes("admin"),
    },
    {
      name: "Review Leads",
      href: "/reviewleads",
      condition:
        finalFeatures?.includes("reviewleads") ||
        finalFeatures?.includes("admin"),
    },
    {
      name: "Add Faqs",
      href: "/addfaqs",
      condition:
        finalFeatures?.includes("addfaqs") || finalFeatures?.includes("admin"),
    },
  ];

  const navigation = allNavigationItems
    .filter((item) => item.condition)
    .map(({ condition, ...item }) => item);

  return (
    <aside
      className="fixed top-0 left-0 w-64 bg-gray-800 text-white h-full transform transition-transform duration-300 ease-in-out"
      style={{ top: "4rem" }}
    >
      <nav className="p-5 space-y-4">
        {navigation.map((item, index) => (
          <Link href={item.href} key={index} passHref>
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
