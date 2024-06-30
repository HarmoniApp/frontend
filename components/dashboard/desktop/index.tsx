import React from "react";
import styles from "./main.module.scss";

export default function DesktopDashboard() {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.firstRow}>
                <div className={styles.schedule}>Schedule</div>
            </div>
            <div className={styles.secondRow}>
                <div className={styles.employee}>Employee</div>
                <div className={styles.notification}>Notification</div>
            </div>
            <div className={styles.thirdRow}>
                <div className={styles.chat}>Chat</div>
                <div className={styles.vacations}>Vacation</div>
            </div>
            <div className={styles.fourthRow}>
                <div className={styles.statistic}>Statistic</div>
                <div className={styles.plannerAi}>Panner AI</div>
            </div>
        </div>
    )
}