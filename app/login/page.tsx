'use client';
import React, { useState } from "react";
import Login from '@/components/login';
import NavbarTop from "@/components/navbar/top";

export default function LoginPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return (
    <div>
        <NavbarTop onAccountIconClick={toggleSidebar}/>
        <Login />
    </div>
  )
}