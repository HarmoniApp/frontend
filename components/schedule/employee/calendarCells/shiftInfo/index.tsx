import React from 'react';
import Shift from '@/components/types/shift';
import styles from './main.module.scss';

interface ShiftInfoProps {
    shift: Shift;
}

const ShiftInfo: React.FC<ShiftInfoProps> = ({ shift }) => {
    return (
        <div className={styles.shiftInfo}>
            <label className={styles.shiftTime}>{shift.start.split('T')[1].slice(0, 5)} - {shift.end.split('T')[1].slice(0, 5)}</label>
            <label className={styles.shiftRole}>{shift.role_name}</label>
        </div>
    );
};
export default ShiftInfo;