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
            <Roles />
            <Departments />
            <PredefinedShifts />
            <SchedulesArchive />
        </div>
    );
}
export default Settings;
