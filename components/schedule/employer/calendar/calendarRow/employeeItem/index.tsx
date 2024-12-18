'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './main.module.scss';
import UserImage from '@/components/userImage';
import Role from '@/components/types/role';
import { fetchUserRoles } from '@/services/roleService';
import { OverlayPanel } from 'primereact/overlaypanel';
interface EmployeeItemProps {
  firstName: string;
  surname: string;
  employeeId: string | undefined;
  userId: number;
}

const EmployeeItem: React.FC<EmployeeItemProps> = ({
  employeeId,
  firstName,
  surname,
  userId,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const overlayRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    const loadEmployeeRoles = async () => {
      await fetchUserRoles(userId, setRoles);
    };
    loadEmployeeRoles();
  }, [userId]);

  const showOverlay = (event: React.MouseEvent) => {
    overlayRef.current?.toggle(event);
  };

  return (
    <div className={styles.employeeItemContainerMain} onMouseEnter={showOverlay} onMouseLeave={showOverlay}>
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
      <OverlayPanel ref={overlayRef}>
        <div className={styles.overlayPanel}>
          <ul className={styles.rolesList}>
            {roles.length > 0 ? (
              roles.map((role) => (
                <li key={role.id} className={styles.roleItem}>
                  {role.name}
                </li>
              ))
            ) : (
              <li>Brak przypisanych ról</li>
            )}
          </ul>
        </div>
      </OverlayPanel>
    </div>
  );
};
export default EmployeeItem;