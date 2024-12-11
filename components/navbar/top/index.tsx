'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import styles from "./main.module.scss";
import Notifications from "./notifications";
import Notification from '@/components/types/notification';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '@/styles/main.css';
import { fetchCsrfToken } from "@/services/csrfService";
import UserImage from "@/components/userImage";
import { fetchNotifications, patchMarkNotificationAsRead } from "@/services/notificationService";
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
    const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            await fetchNotifications(setNotifications, setUnreadCount, userId);
        }

        loadData();
    }, [userId]);

    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`);
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

    const markAsRead = async (id: number) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
        setUnreadCount(notifications.filter(notification => !notification.read && notification.id !== id).length);
        setModalIsOpenLoadning(true);
        try {
            await patchMarkNotificationAsRead(id);
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
        } finally {
            setModalIsOpenLoadning(false);
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

            {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}

            {showNotifications && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <Notifications notifications={notifications} onClose={() => setShowNotifications(false)} markAsRead={markAsRead} />
                    </div>

                    {modalIsOpenLoadning && (
                        // <div className={styles.loadingModalOverlay}>
                        //     <div className={styles.loadingModalContent}>
                        //         <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                        //     </div>
                        // </div>
                        <LoadingSpinner />
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavbarTop;