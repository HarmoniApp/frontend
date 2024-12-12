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
                <CustomButton icon="calendar" writing="Kalendarz" action={() => navigateTo('/schedule')} isDashboard={true}/>
            </div>
            <div className={styles.secondRow}>
                <CustomButton icon="user" writing="Pracownicy" action={() => navigateTo('/employees')} isDashboard={true}/>
                <CustomButton icon="comments" writing="Czat" action={() => navigateTo('/chat')} isDashboard={true}/>
                <CustomButton icon="plane" writing="Urlopy" action={() => navigateTo('/absence')} isDashboard={true}/>
                <CustomButton icon="robot" writing="PlannerAI" action={() => navigateTo('/plannerAI')} isDashboard={true}/>
            </div>
        </div>
    );
};
export default Dashboard;