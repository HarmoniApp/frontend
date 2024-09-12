'use client';
import React, { useState } from 'react';
import NavbarBottom from "./bottom";
import Account from "@/components/account";
import { loggedUserRoleAdmin, loggedUserID } from '@/components/variables';
import NavbarTop from "./top";

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin] = useState<boolean>(loggedUserRoleAdmin);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div>
            <NavbarTop onAccountIconClick={toggleSidebar} userId={loggedUserID}/>
            <Account isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <NavbarBottom isThisAdmin={isAdmin}/>
        </div>
    )
}