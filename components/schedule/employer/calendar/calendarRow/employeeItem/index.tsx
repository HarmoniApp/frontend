import React from 'react';
import styles from './main.module.scss';
interface EmployeeItemProps {
  firstName: string;
  surname: string;
  employeeId: string | undefined;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({ employeeId, firstName, surname }) => {
  return (
    <div className={styles.employeeItemContainerMain}>
      <div className={styles.fullNameContainer}>
        <label className={styles.employeeItemLabel}>{firstName}</label>
        <label className={styles.employeeItemLabel}>{surname}</label>
      </div>
        <label className={styles.employeeItemLabel}>{employeeId}</label>
    </div>
  );
};
export default EmployeeItem;