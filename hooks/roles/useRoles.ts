import { useState, useEffect } from 'react';
import { Role } from '@/components/types/role';
import { fetchRoles } from "@/services/roleService";

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            setLoadingRoles(true);
            await fetchRoles(setRoles);
            setLoadingRoles(false);
        };
        loadData();
    }, []);

    return { roles, loadingRoles };
};