'use client';
import React from "react";
import Notification from "@/components/types/notification";
import styles from "./main.module.scss";

interface NotificationsProps {
    userId: number;
    onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({userId, onClose}) => {
   
    return (
        <div className={styles.notificationContainerMain}>
            <p>User ID: {userId}</p>
            <button onClick={onClose}>Zamknij</button>
        </div>
    );
};

export default Notifications;