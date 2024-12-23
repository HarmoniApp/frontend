import Notification from "@/components/types/notification";
import { fetchNotifications, patchMarkAllNotificationsAsRead } from "@/services/notificationService";
import { Client } from "@stomp/stompjs";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchNotifications(setNotifications, setUnreadCount);
            setLoading(false);
        }
        loadData();
    }, []);

    useEffect(() => {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const userId = sessionStorage.getItem('userId');
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${tokenJWT}`,
            },
            onConnect: () => {
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
    }, []);

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

    return {
        notifications,
        unreadCount,
        loading,
        markAllAsRead,
        setNotifications,
    };
}