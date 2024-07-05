'use client'
import React, { useState } from 'react';

import DesktopDashboard from "../components/dashboard";
import NavbarTop from "../components/navbar/top";
import NavbarBottom from "../components/navbar/bottom";
import Login from "../components/login";
import Resister from "../components/register";
import Chat from "../components/chat";
import Navbar from "@/components/navbar";
import Account from "@/components/account";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* <DesktopDashboard /> */}
      <NavbarTop onAccountIconClick={toggleSidebar}/>
      <Account isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* <NavbarBottom /> */}
      {/* <Login /> */}
      {/* <Resister/> */}
      {/* <Chat /> */}
    </div>
  );
}
