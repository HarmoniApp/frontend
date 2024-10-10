export default interface EmployeeData {
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
    }[];
    languages: {
      id: number;
      name: string;
      code: string;
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