'use client';
import React, { useState, useEffect } from 'react';
import Employee from './employee';
import Employer from './employer';
import LoadingSpinner from '../loadingSpinner';

const Absence = () => {
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

    return (
            <>
                {userId !== 0 ? (
                    isAdmin ? <Employer /> : <Employee userId={userId} />
                ) : (
                    <LoadingSpinner wholeModal={false}/>
                )}
            </>
    )
}
export default Absence;