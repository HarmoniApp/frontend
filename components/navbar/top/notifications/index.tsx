'use client';
import React from "react";
import Notification from '@/components/types/notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
import { deleteNotification } from "@/services/notificationService";
import CustomButton from "@/components/customButton";
interface NotificationsProps {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void ;
    onClose: () => void;
    markAllAsRead: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, setNotifications, onClose, markAllAsRead }) => {

    return (
        <div className={styles.notificationsPopup}>
            <div className={styles.popupHeader}>
                <label className={styles.notificationLabel}>Powiadomienia</label>
                <button onClick={() => {onClose(); markAllAsRead();}} className={styles.backButton}>
                    <FontAwesomeIcon icon={faX} className={styles.icon} /></button>
            </div>
            <div className={styles.notificationsList}>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
                        >
                            <div className={styles.titleContainer}>
                                <small>{new Date(notification.created_at).toLocaleString().slice(0, 17)}</small>
                                <label className={styles.title}>{notification.title}</label>
                                <CustomButton
                                    icon="trashCan"
                                    writing=""
                                    action={() => deleteNotification(notification.id, setNotifications)}
                                />
                            </div>
                            <p className={styles.messagesParagraph}>{notification.message}</p>
                        </div>
                    ))
                ) : (
                    <p>No Notifications</p>
                )}
            </div>
        </div>
    );
};

export default Notifications;