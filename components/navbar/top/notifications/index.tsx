'use client';
import React from "react";
import Notification from '@/components/types/notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";
interface NotificationsProps {
    notifications: Notification[];
    onClose: () => void;
    markAsRead: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onClose, markAsRead }) => {
    return (
        <div className={styles.notificationsPopup}>
            <div className={styles.popupHeader}>
                <label className={styles.notificationLabel}>Powiadomienia</label>
                <button onClick={onClose} className={styles.backButton}><FontAwesomeIcon icon={faX} className={styles.icon}/></button> 
            </div>
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                        <small>Type: {notification.type_name}</small><br />
                        <small>Date: {new Date(notification.created_at).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No Notifications</p>
            )}
        </div>
    );
};

export default Notifications;