'use client';
import React, { useState, useEffect } from 'react';
import NavbarBottom from "./bottom";
import Account from "@/components/account";
import NavbarTop from "./top";
import LoadingSpinner from '@/components/loadingSpinner';

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<number>(0);

    useEffect(() => {
        const storedIsAdmin = sessionStorage.getItem('isAdmin');
        const storedUserId = sessionStorage.getItem('userId');

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
        <>
            {userId !== 0 ? <NavbarTop onAccountIconClick={toggleSidebar} userId={userId} isThisAdmin={isAdmin}/> : <LoadingSpinner wholeModal={false}/>}
            <Account isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <NavbarBottom isThisAdmin={isAdmin}/>
        </>
    )
}