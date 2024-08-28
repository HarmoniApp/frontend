import React from 'react';
import styles from './main.module.scss';

interface EmployeeItemProps {
  name: string;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({ name }) => {
  return (
    <div className={styles.employeeItem}>
      {name}
    </div>
  );
};

export default EmployeeItem;
