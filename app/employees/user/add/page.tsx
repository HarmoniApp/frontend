import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EditEmployeeDataPopUp from '@/components/employees/employeeData/editEmployeeData';

interface EmployeeData {
    id: number;
    firstname: string;
    surname: string;
    email: string;
    residence: {
        id: number;
        city: string;
        street: string;
        apartment: string;
        zip_code: string;
        building_number: string;
    };
    roles: {
        id: number;
        name: string;
        sup: boolean;
    }[];
    languages: {
        id: number;
        name: string;
    }[];
    contract_type: {
        id: number;
        name: string;
    };
    contract_signature: string;
    contract_expiration: string;
    work_address: {
        id: number;
        street: string;
        apartment: string;
        zip_code: string;
        building_number: string;
    };
    supervisor_id: number;
    phone_number: string;
    employee_id: string;
}

const EditEmployeePage = () => {
    const router = useRouter();
    const { userId } = useParams();

    const [employee, setEmployee] = useState<EmployeeData | null>(null);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/api/v1/user/${userId}`)
                .then(response => response.json())
                .then(data => setEmployee(data))
                .catch(error => console.error('Error fetching employee data:', error));
        }
    }, [userId]);

    if (!employee) return <div>Loading...</div>;

    return (
        <EditEmployeeDataPopUp
            employee={employee}
            onCloseEdit={() => router.push(`/employees/user/${userId}`)}
            fetchEmployeeData={() => {}}
        />
    );
};

export default EditEmployeePage;