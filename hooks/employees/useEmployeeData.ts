import { Department } from "@/components/types/department";
import { EmployeeData } from "@/components/types/employeeData";
import { Supervisor } from "@/components/types/supervisor";
import { fetchDepartments } from "@/services/departmentService";
import { patchResetPassword } from "@/services/passwordService";
import { fetchUserData, deleteUser } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useEmployeeData = (userId: number) => {
    const [employee, setEmployee] = useState<EmployeeData | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [supervisorData, setSupervisorData] = useState<Supervisor | null>(null);
    const [modalIsOpenDeleteEmployee, setModalDeleteEmployee] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [modalNewPassword, setModalNewPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (userId) {
            const loadData = async () => {
                setLoading(true);
                await fetchDepartments(setDepartments);
                await fetchUserData(userId, setEmployee, setSupervisorData);
                setLoading(false);
            };

            loadData();
        }
    }, [userId]);

    const handleEditEmployee = () => {
        router.push(`/employees/user/${userId}/edit`);
    };

    const handleDeleteEmployee = async () => {
        try {
            setModalDeleteEmployee(false);
            await deleteUser(userId);
            router.push("/employees");
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handlePasswordResetSubmit = async () => {
        try {
            await patchResetPassword(userId, setNewPassword);
            setModalNewPassword(true);
        } catch (error) {
            console.error('Error while resetting password: ', error);
        }
    };

    return {
        employee,
        departments,
        supervisorData,
        loading,
        modalIsOpenDeleteEmployee,
        modalNewPassword,
        newPassword,
        setModalDeleteEmployee,
        setModalNewPassword,
        handleEditEmployee,
        handleDeleteEmployee,
        handlePasswordResetSubmit,
    };
} 