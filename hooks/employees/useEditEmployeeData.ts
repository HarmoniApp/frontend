import Contract from "@/components/types/contract";
import Department from "@/components/types/department";
import Language from "@/components/types/language";
import Role from "@/components/types/role";
import Supervisor from "@/components/types/supervisor";
import { fetchContracts } from "@/services/contractService";
import { fetchDepartments } from "@/services/departmentService";
import { fetchLanguages } from "@/services/languageService";
import { fetchRoles } from "@/services/roleService";
import { fetchSupervisors, patchUser, postUser } from "@/services/userService";
import { useState, useEffect } from "react";

export const useEmployeeDataManagement = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchContracts(setContracts);
            await fetchDepartments(setDepartments);
            await fetchSupervisors(setSupervisors)
            await fetchRoles(setRoles);
            await fetchLanguages(setLanguages);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleSaveEmployee = async (
        values: any,
        mode: "add" | "edit"
    ) => {
        setLoading(true);
        try {
            if (mode === "add") {
                await postUser(values);
            } else if (mode === "edit") {
                await patchUser(values);
            }
        } catch (error) {
            console.error(`Error ${mode === "add" ? "adding" : "editing"} employee:`, error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        roles,
        contracts,
        languages,
        supervisors,
        departments,
        loading,
        handleSaveEmployee,
    };
}