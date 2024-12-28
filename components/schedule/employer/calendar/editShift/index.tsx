import React, { useEffect, useState } from 'react';
import { Role } from '@/components/types/role';
import { Shift } from '@/components/types/shift';
import { PredefinedShift } from '@/components/types/predefinedShifts';
import styles from './main.module.scss';
import { fetchUserRoles } from '@/services/roleService';
import { fetchPredefinedShifts } from '@/services/predefineShiftService';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import { EditShiftForm } from './editShiftForm';

interface EditShiftModalProps {
  onClose: () => void;
  onEditShift: (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => void;
  onDeleteShift: (shiftId: number, userId: number) => void;
  shift: Shift;
  firstName: string;
  surname: string;
}

const EditShift: React.FC<EditShiftModalProps> = ({ onClose, onEditShift, onDeleteShift, shift, firstName, surname }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchPredefinedShifts(setPredefineShifts);
      await fetchUserRoles(shift.user_id, setRoles);
    }
    loadData();
  }, [shift.user_id]);

  const confirmDeleteShift = (shiftId: number, userId: number) => {
    onDeleteShift(shiftId, userId);
    setIsDeleteConfirmOpen(false);
    onClose();
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {isDeleteConfirmOpen ? (
          <ConfirmationPopUp action={() => confirmDeleteShift(shift.id, shift.user_id)} onClose={() => setIsDeleteConfirmOpen(false)} description={`Usunąć zmianę dla użytkowanika: ${firstName} ${surname}`} />
        ) : (
          <EditShiftForm
            shift={shift}
            firstName={firstName}
            surname={surname}
            roles={roles}
            predefineShifts={predefineShifts}
            onEditShift={onEditShift}
            onClose={onClose}
            setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          />
        )}
      </div>
    </div>
  );
};
export default EditShift;