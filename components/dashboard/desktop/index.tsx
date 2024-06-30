import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faBell, faComments, faPlane, faChartBar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";

const Dashboard = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.firstRow}>
                <div className={styles.schedule}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faCalendar}/></p>
                    <p className={styles.paragraphName}>Kalendarz</p>
                </div>
            </div>
            <div className={styles.secondRow}>
                <div className={styles.employee}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faUser}/></p>
                    <p className={styles.paragraphName}>Pracownicy</p>
                </div>
                <div className={styles.notification}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faBell}/></p>
                    <p className={styles.paragraphName}>Powiadomienia</p>
                </div>
            </div>
            <div className={styles.thirdRow}>
                <div className={styles.chat}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faComments}/></p>
                    <p className={styles.paragraphName}>Czat</p>
                </div>
                <div className={styles.vacations}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faPlane}/></p>
                    <p className={styles.paragraphName}>Urlopy</p>
                </div>
            </div>
            <div className={styles.fourthRow}>
                <div className={styles.statistic}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faChartBar}/></p>
                    <p className={styles.paragraphName}>Statystyki</p>
                </div>
                <div className={styles.plannerAi}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faCheckCircle}/></p>
                    <p className={styles.paragraphName}>PlannerAI</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
