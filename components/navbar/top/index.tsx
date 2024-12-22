'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faL } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
import Notifications from "./notifications";
import '@/styles/main.css';
import UserImage from "@/components/userImage";
import LoadingSpinner from "@/components/loadingSpinner";
import useNotifications from "@/hooks/useNotifications";
interface NavbarTopProps {
    onAccountIconClick: () => void;
    isThisAdmin: boolean;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ onAccountIconClick, isThisAdmin }) => {
    const userId = Number(sessionStorage.getItem('userId'));
    const [showNotifications, setShowNotifications] = useState(false);
    const router = useRouter();
    const {
        notifications,
        unreadCount,
        loading,
        markAllAsRead,
        setNotifications,
    } = useNotifications();

    const clikOnLogo = (loggedUser: boolean) => {
        if (loggedUser == true) {
            router.push('/dashboard');
        }
        else {
            router.push('/schedule');
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <span className={styles.logo} onClick={() => clikOnLogo(isThisAdmin)}>HA</span>
            </div>
            <div className={styles.rightSection}>
                <div className={styles.notificationIconWrapper}>
                    <p onClick={() => setShowNotifications(true)} className={styles.notificationIcon}>
                        <FontAwesomeIcon icon={faBell} className={styles.icon} />
                        {unreadCount > 0 && (
                            <span className={styles.unreadCount}>{unreadCount}</span>
                        )}
                    </p>
                </div>
                <div onClick={onAccountIconClick} className={styles.userPhotoParagraph}>
                    <UserImage userId={userId} />
                </div>
            </div>
            {showNotifications && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <Notifications notifications={notifications} setNotifications={setNotifications} onClose={() => setShowNotifications(false)} markAllAsRead={markAllAsRead} />
                    </div>

                    {loading && <LoadingSpinner />}
                </div>
            )}
        </nav>
    );
};
export default NavbarTop;