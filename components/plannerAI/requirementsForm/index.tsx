import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import PredefinedShift from '@/components/types/predefinedShifts';
import Role from '@/components/types/role';
import Instruction from '@/components/plannerAI/instruction';
import IRequirementsForm from '@/components/types/requirementsForm';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { fetchRoles } from '@/services/roleService';
import { fetchPredefinedShifts } from '@/services/predefineShiftService';
import LoadingSpinner from '@/components/loadingSpinner';
import { generateScheduleAi, revokeScheduleAi } from '@/services/planerAiService';
import CustomButton from '@/components/customButton';
import classNames from 'classnames';

const RequirementsForm: React.FC = () => {
    const [forms, setForms] = useState<IRequirementsForm[]>([
        { id: Date.now(), date: '', shifts: [] },
    ]);

    const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);
    const formRefs = useRef<FormikProps<any>[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchPredefinedShifts(setPredefineShifts);
            await fetchRoles(setRoles);
            setLoading(false);
        };

        loadData();
    }, []);

    const validationSchema = Yup.object({
        date: Yup.date()
            .required('Musisz podać datę')
            .min(new Date(), 'Data nie może być w przeszłości'),
        shifts: Yup.array()
            .min(1, 'Musisz wybrać co najmniej jedną zmianę')
            .required('Pole wymagane'),
        // roles: Yup.array()
        //     .required('Musisz wybrać co najmniej jedną rolę'),
    });

    const handleAddForm = () => {
        setForms((prevForms) => [
            ...prevForms,
            { id: Date.now(), date: '', shifts: [] },
        ]);
    };

    const handleRemoveForm = (id: number) => {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    };

    const handleSubmit = async () => {
        const validationPromises = formRefs.current.map(async (formRef) => {
            await formRef.setTouched({
                date: true,
                shifts: true,
                // roles: true,
            });

            return formRef.validateForm();
        });

        const validationResults = await Promise.all(validationPromises);
        const hasErrors = validationResults.some((errors) => Object.keys(errors).length > 0);
        if (hasErrors) {
            console.error('Niektóre formularze zawierają błędy:', validationResults);
            return;
        }

        const payload = forms.map((form) => ({
            date: form.date,
            shifts: form.shifts.map((shift) => ({
                shiftId: shift.shiftId,
                roles: shift.roles.map((role) => ({
                    roleId: role.roleId,
                    quantity: role.quantity,
                })),
            })),
        }));

        try {
            await generateScheduleAi(payload);
        } catch (error) {
            console.error('Wystąpił błąd przy wysyłaniu danych:', error);
        }
    };

    const handleRevoke = async () => {
        if (!window.confirm('Czy na pewno chcesz usunąć wszystkie ostatnio wygenerowane przez PlanerAi zmiany?')) {
            return;
        }
        try {
            await revokeScheduleAi();
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

    return (
        <div className={styles.planerAiContainer}>
            {forms.map((form, index) => (
                <Formik
                    key={form.id}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={() => { }}
                    innerRef={(instance) => {
                        if (instance) formRefs.current[index] = instance;
                    }}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form className={styles.planerAiForm}>
                            <div className={styles.dateContainer}>
                                <>
                                    <label className={styles.dateLabel}>
                                        Podaj datę na którą chcesz wygenerować grafik:
                                        <Field
                                            name="date"
                                            type="date"
                                            className={classNames(styles.dateInput, styles.pointer, {
                                                [styles.errorInput]: errors.date && touched.date,
                                            })}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue("date", e.target.value);
                                                setForms((prevForms) =>
                                                    prevForms.map((f) =>
                                                        f.id === form.id ? { ...f, date: e.target.value } : f
                                                    )
                                                );
                                            }}
                                        />
                                    </label>
                                </>
                                <ErrorMessage name="date" component="div" className={styles.errorMessage} />
                            </div>
                            <ErrorMessage name="shifts" component="div" className={styles.errorMessage} />
                            <div className={styles.predefineShiftsContainer}>
                                {predefineShifts.map((shift) => {
                                    const isSelected = values.shifts.some((s) => s.shiftId === shift.id);

                                    return (
                                        <label key={shift.id}
                                            className={classNames(styles.predefineShiftLabel, styles.pointer, {
                                                [styles.errorInput]: errors.shifts && touched.shifts,
                                            })}>
                                            <input
                                                type="checkbox"
                                                name="shifts"
                                                checked={isSelected}
                                                className={styles.predefinedShiftCheckbox}
                                                onChange={() => {
                                                    const updatedShifts = isSelected
                                                        ? values.shifts.filter((s) => s.shiftId !== shift.id)
                                                        : [...values.shifts, { shiftId: shift.id, roles: [] }];

                                                    setFieldValue('shifts', updatedShifts);

                                                    setForms((prevForms) =>
                                                        prevForms.map((f) =>
                                                            f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                        )
                                                    );
                                                }}
                                            />
                                            <span className={styles.predefinedShiftCheckboxLabel}>
                                                {shift.name} ({shift.start.slice(0, 5)} - {shift.end.slice(0, 5)})
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                            <div className={styles.rolesContainerMain}>
                                {values.shifts.map((shift) => (
                                        <div key={shift.shiftId} className={styles.roleContainer}>
                                            <ErrorMessage name="roles" component="div" className={styles.errorMessage} />
                                            {roles.map((role) => {
                                                const roleInShift = shift.roles.find((r) => r.roleId === role.id);
                                                const isRoleSelected = !!roleInShift;

                                                return (
                                                    <label key={role.id}
                                                        style={{ backgroundColor: role.color }}
                                                        className={classNames(styles.roleLabel, styles.pointer, {
                                                            [styles.errorInput]: errors.shifts && touched.shifts,
                                                        })}>
                                                        <input
                                                            type="checkbox"
                                                            name="roles"
                                                            checked={isRoleSelected}
                                                            className={styles.rolesCheckbox}
                                                            onChange={() => {
                                                                const updatedRoles = isRoleSelected
                                                                    ? shift.roles.filter((r) => r.roleId !== role.id)
                                                                    : [...shift.roles, { roleId: role.id, quantity: 1 }];

                                                                const updatedShifts = values.shifts.map((s) =>
                                                                    s.shiftId === shift.shiftId ? { ...s, roles: updatedRoles } : s
                                                                );
                                                                setFieldValue('shifts', updatedShifts);

                                                                setForms((prevForms) =>
                                                                    prevForms.map((f) =>
                                                                        f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                        <span className={styles.rolesCheckboxLabel}>{role.name}</span>
                                                        {isRoleSelected && (
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={roleInShift?.quantity || 1}
                                                                className={styles.rolesQuantityInput}
                                                                onChange={(e) => {
                                                                    const newQuantity = Math.max(parseInt(e.target.value, 10) || 1, 1);

                                                                    const updatedRoles = shift.roles.map((r) =>
                                                                        r.roleId === role.id ? { ...r, quantity: newQuantity } : r
                                                                    );

                                                                    const updatedShifts = values.shifts.map((s) =>
                                                                        s.shiftId === shift.shiftId ? { ...s, roles: updatedRoles } : s
                                                                    );

                                                                    setFieldValue('shifts', updatedShifts);

                                                                    const updatedForms = forms.map((f) =>
                                                                        f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                                    );
                                                                    setForms(updatedForms);
                                                                }}
                                                            />
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                ))}
                            </div>
                            <CustomButton icon="trashCan" writing="Usuń dzień" action={() => handleRemoveForm(form.id)} />
                        </Form>
                    )}
                </Formik>
            ))}
            <div className={styles.buttonContainer}>
                <CustomButton icon="chartSimple" writing="Generuj" action={handleSubmit} />
                <CustomButton icon="plus" writing="Dodaj kolejny dzień" action={handleAddForm} />
                <CustomButton icon="eraser" writing="Usuń wszystkie zmiany ostatnio wprowadzone przez PlanerAi" action={handleRevoke} />
                <Instruction isOpen={isInstructionOpen} onClose={() => setIsInstructionOpen(false)} />
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default RequirementsForm;