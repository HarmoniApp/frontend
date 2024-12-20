import Contract from "@/components/types/contract";
import Department from "@/components/types/department";
import Language from "@/components/types/language";
import Role from "@/components/types/role";
import Supervisor from "@/components/types/supervisor";
import { fetchContracts } from "@/services/contractService";
import { fetchDepartments } from "@/services/departmentService";
import { fetchLanguages } from "@/services/languageService";
import { fetchRoles } from "@/services/roleService";
import { fetchSupervisors, patchUser } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const useEditEmployeeData = (onCloseEdit: () => void, initialValues: any) => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
    
      const handleEditUser = async (values: typeof initialValues) => {
        try {
          await patchUser(values);
          onCloseEdit();
          router.refresh()
        } catch (error) {
          console.error('Error while editing user:', error);
        }
      };
      
      return {
        contracts,
        departments,
        supervisors,
        roles,
        languages,
        loading,
        handleEditUser,
      };
}
export default useEditEmployeeData;
