import Absence from "@/components/types/absence";
import AbsenceType from "@/components/types/absenceType";
import User from "@/components/types/user";
import { fetchAbsenceType, patchAbsence } from "@/services/absenceService";
import { fetchSimpleUser } from "@/services/userService";
import { useState, useEffect } from "react";

export const useAbsenceCard = (absence: Absence, onStatusUpdate: () => void) => {
    const [absenceType, setAbsenceType] = useState<AbsenceType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [modalIsOpenCancelAbsence, setModalIsOpenCancelAbsence] = useState(false);
    const [modalIsOpenAproveAbsence, setModalIsOpenAproveAbsence] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchSimpleUser(absence.user_id, setUser, undefined);
            await fetchAbsenceType(absence.absence_type_id, setAbsenceType);
            setLoading(false);
        };
        loadData();

    }, [absence.absence_type_id, absence.user_id]);

    const subbmisionDate = () => new Date(absence.submission).toLocaleDateString();
    const startDate = () => new Date(absence.start).toLocaleDateString();
    const endDate = () => new Date(absence.end).toLocaleDateString();

    const updateAbsenceStatus = async (absenceId: number, statusId: number) => {
        setLoading(true);
        try {
            await patchAbsence(absenceId, statusId)
        } catch (error) {
            console.error('Error updating absence status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeclineClick = async () => {
        try {
            await updateAbsenceStatus(absence.id, 4);
            setModalIsOpenCancelAbsence(false);
            onStatusUpdate();
        } catch (error) {
            console.error('Error rejecting absence:', error);
        }
    };

    const handleAcceptClick = async () => {
        try {
            await updateAbsenceStatus(absence.id, 2);
            setModalIsOpenAproveAbsence(false);
            onStatusUpdate();
        } catch (error) {
            console.error('Error approving absence:', error);
        }
    };

    return {
        absenceType,
        user,
        modalIsOpenCancelAbsence,
        modalIsOpenAproveAbsence,
        loading,
        setModalIsOpenCancelAbsence,
        setModalIsOpenAproveAbsence,
        subbmisionDate,
        startDate,
        endDate,
        handleDeclineClick,
        handleAcceptClick,
    };
}