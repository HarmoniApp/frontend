'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import CustomButton from "@/components/customButton";
import styles from "./main.module.scss";

const Dashboard = () => {
    const router = useRouter();
    const navigateTo = (path:string) => {
        router.push(path);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.firstRow}>
                <CustomButton icon="calendar" writing="Kalendarz" action={() => navigateTo('/schedule')} additionalClass='atDashboard'/>
            </div>
            <div className={styles.secondRow}>
                <CustomButton icon="user" writing="Pracownicy" action={() => navigateTo('/employees')} additionalClass='atDashboard'/>
                <CustomButton icon="comments" writing="Czat" action={() => navigateTo('/chat')} additionalClass='atDashboard'/>
                <CustomButton icon="plane" writing="Urlopy" action={() => navigateTo('/absence')} additionalClass='atDashboard'/>
                <CustomButton icon="robot" writing="PlannerAI" action={() => navigateTo('/plannerAI')} additionalClass='atDashboard'/>
            </div>
        </div>
    );
};
export default Dashboard;