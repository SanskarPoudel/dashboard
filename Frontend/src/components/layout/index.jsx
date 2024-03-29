import React, { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar isOpen={isOpen} />
      <div className="flex-1 flex flex-col">
        <TopBar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
