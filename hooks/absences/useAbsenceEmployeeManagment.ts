import Absence from "@/components/types/absence";
import { deleteAbsence, fetchAvailableAbsenceDays, fetchUserAbsences } from "@/services/absenceService";
import { useState, useEffect } from "react";

export const useAbsenceEmployeeManagment = () => {
    const userId = Number(sessionStorage.getItem('userId'));
    const [modalIsOpenCancelAbsence, setModalIsOpenCancelAbsence] = useState(false);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absenceTypeNames, setAbsenceTypeNames] = useState<{ [key: number]: string }>({});
    const [selectedAbsenceId, setSelectedAbsenceId] = useState<number | null>(null);
    const [selectedAbsenceType, setSelectedAbsenceType] = useState<string>('');
    const [selectedAbsenceStart, setSelectedAbsenceStart] = useState<string>('');
    const [selectedAbsenceEnd, setSelectedAbsenceEnd] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [availableAbsenceDays, setAvailableAbsenceDays] = useState<number | string>('Ładowanie...');

    const handleCancelAbsence = async () => {
        if (selectedAbsenceId === null) return;
        await deleteAbsence(selectedAbsenceId, userId, setAbsenceTypeNames, setAbsences);
        setModalIsOpenCancelAbsence(false);
        await fetchAvailableAbsenceDays(userId, setAvailableAbsenceDays);
    };

    const fetchData = async () => {
        setLoading(true);
        await fetchUserAbsences(userId, setAbsenceTypeNames, setAbsences);
        await fetchAvailableAbsenceDays(userId, setAvailableAbsenceDays);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        absences,
        absenceTypeNames,
        setSelectedAbsenceId,
        selectedAbsenceType,
        setSelectedAbsenceType,
        selectedAbsenceStart,
        setSelectedAbsenceStart,
        selectedAbsenceEnd,
        setSelectedAbsenceEnd,
        loading,
        availableAbsenceDays,
        fetchData,
        handleCancelAbsence,
        modalIsOpenCancelAbsence,
        setModalIsOpenCancelAbsence
    };
}