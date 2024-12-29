"use client";
import React from 'react';
import styles from './main.module.scss';
import { usePredefinedShiftsManagement } from '@/hooks/predefineShifts/usePredefineShifts';
import { AddPredefineShiftForm } from './addPredefineShiftForm';
import { EditPredefineShiftForm } from './editPredefineShiftForm';

const PredefinedShifts = () => {
  const {
    predefineShifts,
    editingShiftId,
    setEditingShiftId,
    isDeleteModalOpen,
    deleteShiftId,
    setIsDeleteModalOpen,
    shiftHours,
    handleAddPredefineShift,
    handleEditPredefineShift,
    handleDeletePredefineShift,
    openDeleteModal,
  } = usePredefinedShiftsManagement();

  return (
    <div className={styles.predefinedShiftsContainerMain}>
      <div className={styles.showShiftMapContainer}>
        {predefineShifts.map((predefineShift) => (
          <EditPredefineShiftForm
            predefineShift={predefineShift}
            editingShiftId={editingShiftId}
            setEditingShiftId={setEditingShiftId}
            handleEditPredefineShift={handleEditPredefineShift}
            isDeleteModalOpen={isDeleteModalOpen}
            shiftHours={shiftHours}
            deleteShiftId={deleteShiftId}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            handleDeletePredefineShift={handleDeletePredefineShift}
            openDeleteModal={openDeleteModal}
          />
        ))}
      </div>
      <AddPredefineShiftForm handleAddPredefineShift={handleAddPredefineShift} />
    </div>
  );
};
export default PredefinedShifts;