import React from 'react';
import styles from './main.module.scss';
interface EmployeeItemProps {
  firstName: string;
  surname: string;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({ firstName, surname }) => {
  return (
    <div className={styles.employeeItemContainerMain}>
      <p className={styles.employeeItemParagraph}>{firstName}</p>
      <p className={styles.employeeItemParagraph}>{surname}</p>
    </div>
  );
};
export default EmployeeItem;