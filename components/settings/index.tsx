'use client';
import React, { useEffect, useState } from 'react';
import Employer from './employer';
import LoadingSpinner from '@/components/loadingSpinner';

const Settings = () => {
    const [userId, setUserId] = useState<number>(0);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');

        if (storedUserId !== null) {
            setUserId(Number(storedUserId));
        }
    }, []);

    return (
        <>
            {userId !== 0 ? (
                <Employer/>
            ) : (
                <LoadingSpinner wholeModal={false}/>
            )}
        </>
    )
}
export default Settings;