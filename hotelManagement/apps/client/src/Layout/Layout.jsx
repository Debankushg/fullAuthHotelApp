import React from "react";
import Sidebar from "../components/Sidebar";
import SideNavHeader from "../components/SideNavHeader";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <SideNavHeader />
        {children}
      </div>
    </div>
  );
};

export default Layout;
