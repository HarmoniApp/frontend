import React from 'react';
import styles from './main.module.scss';
import UserImage from '@/components/userImage';
interface EmployeeItemProps {
  firstName: string;
  surname: string;
  employeeId: string | undefined;
  userId: number;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({ employeeId, firstName, surname, userId }) => {
  return (
    <div className={styles.employeeItemContainerMain}>
      <div className={styles.employeeImageContainer}>
        <UserImage userId={userId} />
      </div>
      <div className={styles.employeeDataContainer}>
        <div className={styles.fullNameContainer}>
          <label className={styles.employeeItemLabel}>{firstName}</label>
          <label className={styles.employeeItemLabel}>{surname}</label>
        </div>
        <label className={styles.employeeItemLabel}>{employeeId}</label>
      </div>
    </div>
  );
};
export default EmployeeItem;