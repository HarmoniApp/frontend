import PredefinedShift from "@/components/types/predefinedShifts";
import { deletePredefineShift, fetchPredefinedShifts, postPredefineShift, putPredefineShift } from "@/services/predefineShiftService";
import { useEffect, useState } from "react";

export const usePredefinedShifts = () => {
    const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
    const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteShiftId, setDeleteShiftId] = useState<number | null>(null);

    const openDeleteModal = (shiftId: number) => {
        setDeleteShiftId(shiftId);
        setIsDeleteModalOpen(true);
    };

    const shiftHours: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            shiftHours.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            await fetchPredefinedShifts(setPredefineShifts);
        }
        loadData();
    }, []);

    const handleAddPredefineShift = async (values: any, { resetForm }: any) => {
        try {
            await postPredefineShift(values, setPredefineShifts);
            resetForm();
        } catch (error) {
            console.error('Error adding predefine shift:', error);
            throw error;
        }
    };

    const handleEditPredefineShift = async (values: PredefinedShift, { resetForm }: any) => {
        try {
            setEditingShiftId(null);
            await putPredefineShift(values, setPredefineShifts);
            resetForm();
        }
        catch (error) {
            console.error("Error updating predefine shift:", error);
        }
    };

    const handleDeletePredefineShift = async (shiftId: number) => {
        setIsDeleteModalOpen(false);
        await deletePredefineShift(shiftId, setPredefineShifts);
    };

    return {
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
    };
}