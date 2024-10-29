'use client';
import React, { useState, useEffect } from 'react';
import NavbarBottom from "./bottom";
import Account from "@/components/account";
import NavbarTop from "./top";

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<number>(0);

    useEffect(() => {
        const storedIsAdmin = localStorage.getItem('isAdmin');
        const storedUserId = localStorage.getItem('userId');

        if (storedIsAdmin !== null) {
            setIsAdmin(JSON.parse(storedIsAdmin));
        }
        if (storedUserId !== null) {
            setUserId(Number(storedUserId));
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div>
            <NavbarTop onAccountIconClick={toggleSidebar} userId={userId}/>
            <Account isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <NavbarBottom isThisAdmin={isAdmin}/>
        </div>
    )
}