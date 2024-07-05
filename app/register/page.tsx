'use client';
import React, { useState } from "react";
import Register from '@/components/register';
import NavbarTop from "@/components/navbar/top";

export default function RegisterPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  return (
    <div>
        <NavbarTop onAccountIconClick={toggleSidebar}/>
        <Register />
    </div>
  )
}