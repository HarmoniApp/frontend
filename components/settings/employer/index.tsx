import React, { useState } from 'react';
import Roles from './roles';
import Departments from './departments';
import PredefinedShifts from './predefinedShifts';
import ContractTypes from './contractTypes';
import { Message } from 'primereact/message';
import styles from './main.module.scss';

const SettingsEmployer = () => {
    const [error, setError] = useState<string | null>(null);

    return (
        <div className={styles.settingsContainerMain}>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsTitleContainer}>
                    <label className={styles.settingsTitle}>Personalizuj ustawienia, jak chcesz!</label>
                </div>
            </div>
            <div className={styles.rolesContainer}>
                <div className={styles.rolesTitleContainer}>
                    <label className={styles.rolesTitle}>Twoje role, Twoje kolory - Pełna fantazja!</label>
                    <label className={styles.rolesDescription}>Zarządzaj rolami jak nigdy dotąd! Zmieniaj kolory, edytuj dane i usuwaj role, które nie są już potrzebne. Ty decydujesz!</label>
                </div>
                <Roles setError={setError}/>
            </div>
            <div className={styles.departmentsContainer}>
                <div className={styles.departmentsTitleContainer}>
                    <label className={styles.departmentsTitle}>Oddziały w Twoich rękach!</label>
                    <label className={styles.departmentsDescription}>Rozbudowuj swoją sieć oddziałów! Dodawaj nowe lokalizacje, aktualizuj szczegóły i usuwaj nieaktualne oddziały. Wszystko w jednym miejscu!</label>
                </div>
                <Departments setError={setError}/>
            </div>
            <div className={styles.predefinedShiftsContainer}>
                <div className={styles.predefinedShiftsTitleContainer}>
                    <label className={styles.predefinedShiftsTitle}>Zarządzaj predefiniowanymi zmianami z lekkością!</label>
                    <label className={styles.predefinedShiftsDescription}>Dodaj nowe predefiniowane zmiany, edytuj istniejące godziny pracy lub usuń te, które już się nie przydadzą. Twoje zmiany, Twoje zasady!</label>
                </div>
                <PredefinedShifts setError={setError}/>
            </div>
            <div className={styles.contractTypesContainer}>
                <div className={styles.contractTypesTitleContainer}>
                    <label className={styles.contractTypesTitle}>Zarządzaj typami umów i dniami urlopowymi!</label>
                    <label className={styles.contractTypesDescription}>Ustal liczbę dni urlopowych dla każdego typu umowy zgodnie z polityką firmy. Dodawaj nowe typy umów lub aktualizuj istniejące, aby łatwo zarządzać czasem wolnym swoich pracowników.</label>
                </div>
                <ContractTypes setError={setError}/>
            </div>
            {error && <Message severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
        </div>
    );
}
export default SettingsEmployer;
