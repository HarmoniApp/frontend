import React from 'react';
import styles from './main.module.scss';
import RoleForm from '../roleForm';
import PredefineShiftForm from '../predefineShiftForm';

interface PredefineShiftsAndRolesProps {
    predefineShifts: any[];
    roles: any[];
    values: any;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    setForms: React.Dispatch<React.SetStateAction<any[]>>;
    form: any;
}

const PredefineShiftsAndRoles: React.FC<PredefineShiftsAndRolesProps> = ({ predefineShifts, roles, values, errors, touched, setFieldValue, setForms, form }) => (
    <>
        <PredefineShiftForm
            predefineShifts={predefineShifts}
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setForms={setForms}
            form={form}
        />
        <div className={styles.rolesContainerMain}>
            {values.shifts.map((shift: any) => (
                <div key={shift.shiftId}>
                    <div className={styles.rolesInfoContainer}>
                        <hr />
                        <p className={styles.editingShiftIdParagraph}>
                            Ustawiasz rolę dla predefiniowanej zmiany o nazwie:
                            <label className={styles.setRolesForPredefineShiftHighlight}>
                                {predefineShifts.find((s) => s.id === shift.shiftId)?.name || 'Nieznana zmiana'}
                            </label>
                        </p>
                    </div>
                    <RoleForm
                        roles={roles}
                        shift={shift}
                        values={values}
                        setFieldValue={setFieldValue}
                        setForms={setForms}
                        form={form}
                    />
                </div>
            ))}
        </div>
    </>
);

export default PredefineShiftsAndRoles;