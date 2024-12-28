import React, { useEffect, useState } from 'react';
import { Role } from '@/components/types/role';
import { User } from '@/components/types/user';
import { PredefinedShift } from '@/components/types/predefinedShifts';
import styles from './main.module.scss';
import { fetchUserRoles } from '@/services/roleService';
import { fetchPredefinedShifts } from '@/services/predefineShiftService';
import { AddShiftForm } from './addShiftForm/addShiftForm';

interface AddShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddShift: (shiftData: { start: string; end: string; userId: number; roleName: string }) => void;
    user: User;
    day: string;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ isOpen, onClose, onAddShift, user, day }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        const loadData = async () => {
            await fetchPredefinedShifts(setPredefineShifts);
            await fetchUserRoles(user.id, setRoles);
        }
        loadData();
    }, [isOpen, user.id]);

    return isOpen ? (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <AddShiftForm
                    onClose={onClose}
                    onAddShift={onAddShift}
                    user={user}
                    day={day}
                    predefineShifts={predefineShifts}
                    roles={roles}
                />
            </div>
        </div>
    ) : null;
};
export default AddShiftModal;