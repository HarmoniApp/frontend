'use client';
import React, { useState } from "react";
import NavbarTop from "@/components/navbar/top";
import DashboardCenter from "@/components/dashboard";
import Account from "@/components/account";

export default function Dashboard() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <NavbarTop onAccountIconClick={toggleSidebar}/>
            <Account isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <DashboardCenter />
        </div>
    )
}