import React from 'react';
import Shift from '@/components/types/shift';
import styles from './main.module.scss';
import { Tooltip } from 'primereact/tooltip';
import { wrapText } from '@/utils/wrapText';

interface ShiftInfoProps {
    shift: Shift;
}

const ShiftInfo: React.FC<ShiftInfoProps> = ({ shift }) => {
    const isTruncated = wrapText(shift.role_name, 14) !== shift.role_name;
    const elementId = `shiftrole-${shift.id}`;
    return (
        <div className={styles.shiftInfo}>
            <label className={styles.shiftTime}>{shift.start.split('T')[1].slice(0, 5)} - {shift.end.split('T')[1].slice(0, 5)}</label>
            <label
                className={styles.shiftRole}
                data-pr-tooltip={shift.role_name}
                data-pr-position="bottom"
                id={elementId}
                style={{
                    cursor: isTruncated ? 'pointer' : 'default',
                }}>{wrapText(shift.role_name, 14)}</label>
            {isTruncated && (
                <Tooltip target={`#${elementId}`} autoHide />
            )}
        </div>
    );
};
export default ShiftInfo;