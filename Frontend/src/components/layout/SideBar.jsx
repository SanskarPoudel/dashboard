import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const SideBar = ({ isOpen }) => {
  const router = useRouter();
  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    // Add more navigation items here
  ];

  return (
    <aside
      className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-full transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ top: "4rem" /* Adjust based on your topbar's height */ }}
    >
      <nav className="p-5 space-y-4">
        {navigation.map((item) => (
          <Link href={item.href} key={item.name} passHref>
            <div
              className={`cursor-pointer block py-2 px-4 hover:bg-gray-600 rounded-lg ${
                router.pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
