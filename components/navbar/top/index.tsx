'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faL } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
import Notifications from "./notifications";
import Notification from '@/components/types/notification';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '@/styles/main.css';
import UserImage from "@/components/userImage";
import { fetchNotifications, patchMarkAllNotificationsAsRead } from "@/services/notificationService";
import LoadingSpinner from "@/components/loadingSpinner";
interface NavbarTopProps {
    onAccountIconClick: () => void;
    userId: number;
    isThisAdmin: boolean;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ onAccountIconClick, userId, isThisAdmin }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchNotifications(setNotifications, setUnreadCount, userId);
            setLoading(false);
        }

        loadData();
    }, [userId]);

    useEffect(() => {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${tokenJWT}`,
              },
            // debug: (str) => console.log(str),
            onConnect: () => {
                // console.log('Connected STOMP WebSocket');

                stompClient.subscribe(`/client/notifications/${userId}`, (message) => {
                    const newNotification: Notification = JSON.parse(message.body);

                    setNotifications((prevNotifications) => {
                        const updatedNotifications = [newNotification, ...prevNotifications];

                        const unread = updatedNotifications.filter(notification => !notification.read).length;
                        setUnreadCount(unread);

                        return updatedNotifications;
                    });
                });
            },
            onStompError: (error) => {
                console.error('STOMP WebSocket error:', error);
            }
        });

        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [userId]);

    const markAllAsRead = async () => {
        setLoading(true);
        setNotifications(notifications.map(notification => ({
            ...notification,
            read: true
        })));
        setUnreadCount(0);
        try {
            await patchMarkAllNotificationsAsRead();
        } catch (error) {
            console.error(`Error marking notifications as read:`, error);
        } finally {
            setLoading(false);
        }
    };

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
                        <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} markAllAsRead={markAllAsRead} />
                    </div>

                    {loading && <LoadingSpinner />}
                </div>
            )}
        </nav>
    );
};
export default NavbarTop;