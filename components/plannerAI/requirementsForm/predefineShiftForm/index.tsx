import React from 'react';
import classNames from 'classnames';
import styles from './main.module.scss';
import PredefinedShift from '@/components/types/predefinedShifts';

interface PredefinedShiftFormProps {
    predefineShifts: PredefinedShift[];
    values: any;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    setForms: React.Dispatch<React.SetStateAction<any[]>>;
    form: any;
}

const PredefinedShiftForm: React.FC<PredefinedShiftFormProps> = ({ predefineShifts, values, errors, touched, setFieldValue, setForms, form }) => {
    const handleShiftChange = (shiftId: number, isSelected: boolean) => {
        const updatedShifts = isSelected
            ? values.shifts.filter((s: any) => s.shiftId !== shiftId)
            : [...values.shifts, { shiftId, roles: [] }];

        setFieldValue('shifts', updatedShifts);

        setForms((prevForms) =>
            prevForms.map((f) => (f.id === form.id ? { ...f, shifts: updatedShifts } : f))
        );
    };

    return (
        <div className={styles.predefineShiftsContainer}>
            {predefineShifts.map((shift) => {
                const isSelected = values.shifts.some((s: any) => s.shiftId === shift.id);

                return (
                    <label
                        key={shift.id}
                        className={classNames(styles.predefineShiftLabel, styles.pointer, {
                            [styles.errorInput]: errors.shifts && touched.shifts,
                        })}
                    >
                        <input
                            type="checkbox"
                            name="shifts"
                            checked={isSelected}
                            className={styles.predefinedShiftCheckbox}
                            onChange={() => handleShiftChange(shift.id, isSelected)}
                        />
                        <span className={styles.predefinedShiftCheckboxLabel}>
                            {shift.name} ({shift.start.slice(0, 5)} - {shift.end.slice(0, 5)})
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default PredefinedShiftForm;