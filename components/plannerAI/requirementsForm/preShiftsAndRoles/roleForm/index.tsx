import React from 'react';
import classNames from 'classnames';
import styles from './main.module.scss';
import { Role } from '@/components/types/role';

interface RoleFormProps {
    roles: Role[];
    shift: any;
    values: any;
    setFieldValue: (field: string, value: any) => void;
    setForms: React.Dispatch<React.SetStateAction<any[]>>;
    form: any;
}

const RoleForm: React.FC<RoleFormProps> = ({ roles, shift, values, setFieldValue, setForms, form }) => {
    const updateShifts = (updatedRoles: any) => {
        const updatedShifts = values.shifts.map((s: any) =>
            s.shiftId === shift.shiftId ? { ...s, roles: updatedRoles } : s
        );

        setFieldValue('shifts', updatedShifts);

        setForms((prevForms) =>
            prevForms.map((f) => (f.id === form.id ? { ...f, shifts: updatedShifts } : f))
        );
    };

    return (
        <div className={styles.roleContainer}>
            {roles.map((role) => {
                const roleInShift = shift.roles.find((r: any) => r.roleId === role.id);
                const isRoleSelected = !!roleInShift;

                const handleCheckboxChange = () => {
                    const updatedRoles = isRoleSelected
                        ? shift.roles.filter((r: any) => r.roleId !== role.id)
                        : [...shift.roles, { roleId: role.id, quantity: 1 }];

                    updateShifts(updatedRoles);
                };

                const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newQuantity = Math.max(parseInt(e.target.value, 10) || 1, 1);

                    const updatedRoles = shift.roles.map((r: any) =>
                        r.roleId === role.id ? { ...r, quantity: newQuantity } : r
                    );

                    updateShifts(updatedRoles);
                };

                return (
                    <label
                        key={role.id}
                        style={{ backgroundColor: role.color }}
                        className={classNames(styles.roleLabel, styles.pointer)}
                    >
                        <input
                            type="checkbox"
                            name="roles"
                            checked={isRoleSelected}
                            className={styles.rolesCheckbox}
                            onChange={handleCheckboxChange}
                        />
                        <span className={styles.rolesCheckboxLabel}>{role.name}</span>
                        {isRoleSelected && (
                            <input
                                type="number"
                                min="1"
                                value={roleInShift?.quantity || 1}
                                className={styles.rolesQuantityInput}
                                onChange={handleQuantityChange}
                            />
                        )}
                    </label>
                );
            })}
        </div>
    );
};

export default RoleForm;