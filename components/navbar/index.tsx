'use client'
import React, { useState } from "react";
import NavbarBottom from "./bottom";
import Account from "@/components/account";
import NavbarTop from "./top";

export default function Navbar() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const whoIsLogged = true;
    const userId = 1;
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div>
            <NavbarTop onAccountIconClick={toggleSidebar} userId={userId}/>
            <Account isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <NavbarBottom isThisAdmin={whoIsLogged}/>
        </div>
    )
}