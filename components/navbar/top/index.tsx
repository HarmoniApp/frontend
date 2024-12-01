'use client';
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
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
    const [userPhoto, setUserPhoto] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenJWT}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch notifications');
            const data: Notification[] = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(notification => !notification.read).length);
        } catch (error) {
            console.error('Error while fetching notifications:', error);
            setError('Błąd podczas pobierania powiadomień');
        }
    };

    useEffect(() => {
        fetchNotifications();
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

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
    };

    const closeNotifications = () => {
        setShowNotifications(false);
    };

    const markAsRead = async (id: number) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
        setUnreadCount(notifications.filter(notification => !notification.read && notification.id !== id).length);
        setModalIsOpenLoadning(true);
        try {
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenJWT}`,
                },
                credentials: 'include',
            });

            if (resquestXsrfToken.ok) {
                const data = await resquestXsrfToken.json();
                const tokenXSRF = data.token;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification/${id}/read`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    console.error("Failed to mark notification as read: ", response.statusText);
                    throw new Error(`Failed to mark notification as read: ${id}`);
                }
                setModalIsOpenLoadning(false);

            } else {
                console.error('Failed to fetch XSRF token, response not OK');
            }

        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            setError('Błąd podczas czytania powiadomień');
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

    const fetchUserPhoto = async (userId: number) => {
        try {
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            if (!tokenJWT) {
                throw new Error('Token JWT not found in session storage');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/photo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenJWT}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user photo: ${response.statusText}`);
            }

            const blob = await response.blob();
            setUserPhoto(blob);
        } catch (error) {
            console.error('Error while fetching user photo:', error);
            setError('Błąd podczas pobierania zdjęcia');
        }
    };

    useEffect(() => {
        fetchUserPhoto(userId);
    }, [userId]);

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <span className={styles.logo} onClick={() => clikOnLogo(isThisAdmin)}>HA</span>
            </div>
            <div className={styles.rightSection}>
                <div className={styles.notificationIconWrapper}>
                    <p onClick={handleBellClick} className={styles.notificationIcon}>
                        <FontAwesomeIcon icon={faBell} className={styles.icon} />
                        {unreadCount > 0 && (
                            <span className={styles.unreadCount}>{unreadCount}</span>
                        )}
                    </p>
                </div>
                <div onClick={onAccountIconClick} className={styles.userPhotoParagraph}>
                    {userPhoto ? (
                        <img
                            src={URL.createObjectURL(userPhoto)}
                            alt="UserPhoto"
                            className={styles.userPhoto}
                        />
                    ) : (
                        <ProgressSpinner className="progressSpinnerImage" />
                    )}
                </div>
            </div>

            {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}

            {showNotifications && (
                <div className={styles.modalOverlayOfNotification}>
                    <div className={styles.modalContentOfNotification}>
                        <Notifications notifications={notifications} onClose={closeNotifications} markAsRead={markAsRead} />
                    </div>

                    {modalIsOpenLoadning && (
                        <div className={styles.loadingModalOverlay}>
                            <div className={styles.loadingModalContent}>
                                <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavbarTop;