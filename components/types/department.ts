export  interface Department {
  id: number;
  departmentName: string;
}

export  interface DepartmentAddress {
  id: number;
  city: string;
  street: string;
  apartment: string;
  zip_code: string;
  building_number: string;
  department_name: string;
}