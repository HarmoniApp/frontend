'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faComments, faPlane, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";

const Dashboard = () => {

    const router = useRouter();
    const scheduleToGo = () => {
        router.push('/schedule');
    };
    const employeesToGo = () => {
        router.push('/employees');
    };
    const chatToGo = () => {
        router.push('/chat');
    };
    const vacationToGo = () => {
        router.push('/absence');
    };
    const plannerAiToGo = () => {
        router.push('/plannerAI');
    };
    return (
        <div className={styles.mainContainer}>
            <div className={styles.firstRow}>
                <div className={styles.schedule} onClick={scheduleToGo}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faCalendar} /></p>
                    <p className={styles.paragraphName}>Kalendarz</p>
                </div>
            </div>
            <div className={styles.secondRow}>
                <div className={styles.employee} onClick={employeesToGo}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faUser} /></p>
                    <p className={styles.paragraphName}>Pracownicy</p>  
                </div>
                <div className={styles.chat} onClick={chatToGo}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faComments} /></p>
                    <p className={styles.paragraphName}>Czat</p>
                </div>
                <div className={styles.vacations} onClick={vacationToGo}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faPlane} /></p>
                    <p className={styles.paragraphName}>Urlopy</p>
                </div>
                <div className={styles.plannerAi} onClick={plannerAiToGo}>
                    <p className={styles.icon}><FontAwesomeIcon icon={faCheckCircle} /></p>
                    <p className={styles.paragraphName}>PlannerAI</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
