import Navbar from "@/components/navbar";
import EmployeeDataComponent from '@/components/employees/employeeData';

export default function EmployeeData({ params }: { params: { id: number } }) {
    return (
      <div>
        <Navbar />
        <EmployeeDataComponent userId={params.id} />
      </div>
    );
  }
  