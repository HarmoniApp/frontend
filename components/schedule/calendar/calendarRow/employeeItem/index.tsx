import React from 'react';
import styles from './main.module.scss';

interface EmployeeItemProps {
  firstName: string;
  surname: string;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({ firstName, surname }) => {
  return (
    <div className={styles.employeeItem}>
      <p>{firstName} {surname}</p>  
    </div>
  );
};

export default EmployeeItem;
