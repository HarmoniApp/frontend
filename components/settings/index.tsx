import React from 'react';
import Roles from './roles';
import Departments from './departments';
import PredefinedShifts from './predefinedShifts';
import SchedulesArchive from './schedulesArchive';
import styles from './main.module.scss';

const Settings: React.FC = () => {
    return (
        <div className={styles.settingsContainerMain}>
            <h1>Settings</h1>
            <div className={styles.rolesContainer}>
                <div className={styles.rolesTitleContainer}>
                    <label className={styles.rolesTitle}>Twoje role, Twoje kolory - Pełna fantazja!</label>
                    <label className={styles.rolesDescription}>Zarządzaj rolami jak nigdy dotąd! Zmieniaj kolory, edytuj dane i usuwaj role, które nie są już potrzebne. Ty decydujesz!</label>
                </div>
            </div>
            <Roles />
            
            <div className={styles.departmentsContainer}>
                <div className={styles.departmentsTitleContainer}>
                    <label className={styles.departmentsTitle}>Oddziały w Twoich rękach!</label>
                    <label className={styles.departmentsDescription}>Rozbudowuj swoją sieć oddziałów! Dodawaj nowe lokalizacje, aktualizuj szczegóły i usuwaj nieaktualne oddziały. Wszystko w jednym miejscu!</label>
                </div>
            </div>
            <Departments />

            <div className={styles.predefinedShiftsContainer}>
                <div className={styles.predefinedShiftsTitleContainer}>
                    <label className={styles.predefinedShiftsTitle}>Zarządzaj predefiniowanymi zmianami z lekkością!</label>
                    <label className={styles.predefinedShiftsDescription}>Dodaj nowe predefiniowane zmiany, edytuj istniejące godziny pracy lub usuń te, które już się nie przydadzą. Twoje zmiany, Twoje zasady!</label>
                </div>
            </div>
            <PredefinedShifts />

            <div className={styles.schedulesArchiveContainer}>
                <div className={styles.schedulesArchiveTitleContainer}>
                    <label className={styles.schedulesArchiveTitle}>Archiwum Kalendarzy - Twoje dane, zawsze pod ręką!</label>
                    <label className={styles.schedulesArchiveDescription}>Zachowaj pełną kontrolę nad przeszłością - pobierz i przeglądaj swoje zaarchiwizowane kalendarze miesięczne w każdej chwili.</label>
                </div>
            </div>
            <SchedulesArchive />
        </div>
    );
}
export default Settings;
