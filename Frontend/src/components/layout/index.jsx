import React, { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
