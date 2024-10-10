'use client';
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSearch, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
import './main.css';
import Notifications from "./notifications";
import Notification from '@/components/types/notification';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
interface NavbarTopProps {
    onAccountIconClick: () => void;
    userId: number;
}

const NavbarTop: React.FC<NavbarTopProps> = ({ onAccountIconClick, userId}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const pathname = usePathname();
    const mustBeBackButton = pathname === '/dashboard' || pathname === '/register' || pathname === '/login';
    const mustBeAccoutButton = pathname === '/register' || pathname === '/login';

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/notification/user/${userId}`);
                const data: Notification[] = await response.json();
                setNotifications(data);

                const unread = data.filter(notification => !notification.read).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Error while fetching notifications:', error);
            }
        }

        fetchNotifications();
    }, [userId]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/api/v1/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('Connected STOMP WebSocket');

                stompClient.subscribe(`/client/notifications/${userId}`, (message) => {
                    const newNotification: Notification = JSON.parse(message.body);

                    setNotifications((prevNotifications) => {
                        const updatedNotifications = [...prevNotifications, newNotification];

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

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
    };

    const closeNotifications = () => {
        setShowNotifications(false);
    };

    const markAsRead = async (id: number) => {
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);

        const unread = updatedNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);

        await fetch(`http://localhost:8080/api/v1/notification/${id}/read`, { method: 'PATCH' });
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                {!mustBeBackButton && <p><FontAwesomeIcon icon={faPlay} className={`${styles.icon} ${styles.rotate}`} /></p>}
                <span className={styles.logo}>HA</span>
            </div>
            <div className={styles.rightSection}>
                {!mustBeBackButton && <p><FontAwesomeIcon icon={faSearch} className={`${styles.icon} ${pathname !== '/schedule' && pathname !== '/employees' ? styles.hidden : ''}`} /></p>}
                {!mustBeAccoutButton && (
                    <div className={styles.notificationIconWrapper}>
                        <p onClick={handleBellClick} className={styles.notificationIcon}>
                            <FontAwesomeIcon icon={faBell} className={styles.icon}/>
                            {unreadCount > 0 && (
                                <span className={styles.unreadCount}>{unreadCount}</span>
                            )}
                        </p>
                    </div>
                )}
                {!mustBeAccoutButton && <p onClick={onAccountIconClick}><FontAwesomeIcon icon={faUser} className={`${styles.icon} ${pathname === '/settings' ? styles.active : ''}`} /></p>}
            </div>

            {showNotifications && (
                <div className={styles.modalOverlayOfNotification}>
                    <div className={styles.modalContentOfNotification}>
                        <Notifications notifications={notifications} onClose={closeNotifications} markAsRead={markAsRead} />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarTop;