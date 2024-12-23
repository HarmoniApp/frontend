import Absence from "@/components/types/absence";
import AbsenceStatus from "@/components/types/absenceStatus";
import { fetchAbsences, fetchAbsencesStatus, fetchAbsencesByStatus } from "@/services/absenceService";
import { useState, useEffect } from "react";

export const useAbsenceEmployer = () => {
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [absencesStatus, setAbsencesStatus] = useState<AbsenceStatus[]>([]);
    const [viewMode, setViewMode] = useState('tiles');
    const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await fetchAbsences(setAbsences);
            await fetchAbsencesStatus(setAbsencesStatus);
            setLoading(false)
        };
        loadData();
    }, []);

    const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const statusId = event.target.value === 'clear' ? undefined : parseInt(event.target.value);

        setLoading(true);
        setSelectedStatus(statusId);

        try {
            if (statusId !== undefined) {
                await fetchAbsencesByStatus(setAbsences, statusId)
            } else {
                await fetchAbsences(setAbsences);
            }
        } catch (error) {
            console.error('Error fetching absences by status:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAbsences = absences.filter(absence => {
        if (searchQuery === '') {
            return true;
        }
        const userFirstNameMatches = absence.firstname.toLowerCase().includes(searchQuery.toLowerCase());
        const userSurnameMatches = absence.surname.toLowerCase().includes(searchQuery.toLowerCase());
        return userFirstNameMatches || userSurnameMatches;
    });

    return {
        absences: filteredAbsences,
        setAbsences,
        absencesStatus,
        viewMode,
        selectedStatus,
        searchQuery,
        loading,
        setViewMode,
        setSearchQuery,
        handleStatusChange,
    };
}