'use client'
import React, { useState } from "react";
import NavbarBottom from "./bottom";
import NavbarTop from "./top";

export default function Navbar() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div>
            <NavbarTop onAccountIconClick={toggleSidebar} />
            <NavbarBottom />
        </div>
    )
}