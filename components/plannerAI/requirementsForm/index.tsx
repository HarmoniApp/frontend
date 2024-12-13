import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
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

const RequirementsForm: React.FC = () => {
    const [forms, setForms] = useState<IRequirementsForm[]>([
        { id: Date.now(), date: '', shifts: [] },
    ]);
    const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [formCounter, setFormCounter] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchPredefinedShifts(setPredefineShifts);
            await fetchRoles(setRoles);
            setLoading(false);
        }

        loadData();
    }, []);

    const handleRevoke = async () => {
        setLoading(true);

        if (!window.confirm('Czy na pewno chcesz usunąć wszystkie ostatnio wygenerowane przez PlanerAi zmiany?')) {
            setLoading(false);
            return;
        }

        try {
            await revokeScheduleAi();
            setLoading(false);
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    }

    const handleAddForm = () => {
        setForms((prevForms) => [
            ...prevForms,
            { id: Date.now() + formCounter, date: '', shifts: [] },
        ]);
        setFormCounter((prevCounter) => prevCounter + 1);
    };

    const handleRemoveForm = (id: number) => {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const invalidForms = forms.filter((form) => !form.date || form.shifts.length === 0 || form.shifts.some((shift) => shift.roles.length === 0));
        if (invalidForms.length > 0) {
            console.error('Invalid forms detected:', invalidForms);
            setLoading(false);
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

        if (payload.some((form) => !form.date || form.shifts.length === 0)) {
            console.error('Payload contains invalid data. Please check your inputs.');
            setLoading(false);
            return;
        }
        try {
            await generateScheduleAi(payload);
            setLoading(false);
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

    const validationSchema = Yup.object({
        date: Yup.date().required('Pole wymagane').min(new Date(), 'Data nie może być w przeszłości'),
    });

    return (
        <div className={styles.planerAiContainer}>
            {forms.map((form) => (
                <Formik
                    key={form.id}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const updatedForms = [...forms];
                        const formIndex = updatedForms.findIndex((f) => f.id === form.id);
                        if (formIndex !== -1) {
                            updatedForms[formIndex] = { ...updatedForms[formIndex], ...values };
                            setForms(updatedForms);
                        } else {
                            console.error('Form not found in forms array!');
                        }
                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validateOnSubmit={true}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form className={styles.planerAiForm}>
                            <div className={styles.dateContainer}>
                                <label className={styles.dateLabel}>Podaj datę na którą chcesz wygenerować grafik:</label>
                                <Field
                                    name="date"
                                    type="date"
                                    className={styles.dateInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setFieldValue("date", e.target.value);
                                        const updatedForms = forms.map((f) =>
                                            f.id === form.id ? { ...f, date: e.target.value } : f
                                        );
                                        setForms(updatedForms);
                                        // console.log("Updated forms state:", JSON.stringify(updatedForms, null, 2));
                                    }}
                                />
                                {errors.date && touched.date && (
                                    <div className={styles.errorMessage}>{errors.date}</div>
                                )}
                            </div>
                            <div className={styles.predefineShiftsContainer}>
                                {predefineShifts.map((shift) => {
                                    const isSelected = values.shifts.some((s) => s.shiftId === shift.id);
                                    return (
                                        <label key={shift.id} className={styles.predefineShiftLabel}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                className={styles.predefinedShiftCheckbox}
                                                onChange={() => {
                                                    const updatedShifts = isSelected
                                                        ? values.shifts.filter((s) => s.shiftId !== shift.id)
                                                        : [...values.shifts, { shiftId: shift.id, roles: [] }];
                                                    setFieldValue('shifts', updatedShifts);

                                                    const updatedForms = forms.map((f) =>
                                                        f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                    );
                                                    setForms(updatedForms);
                                                }}
                                            />
                                            <span className={styles.predefinedShiftCheckboxLabel}>{shift.name} ({shift.start.slice(0, 5)} - {shift.end.slice(0, 5)})</span>
                                        </label>
                                    );
                                })}
                            </div>
                            <div className={styles.rolesContainerMain}>
                                {values.shifts.map((shift) => (
                                    <>
                                        <div className={styles.rolesInfoContainer}>
                                            <hr />
                                            <p className={styles.editingShiftIdParagraph}>Ustawiasz rolę dla predefiniowanej zmiany o nazwie: <label className={styles.setRolesForPredefineShiftHighlight}>{predefineShifts.find(s => s.id === shift.shiftId)?.name || 'Nieznana zmiana'}</label></p>
                                        </div>
                                        <div key={shift.shiftId} className={styles.roleContainer}>
                                            {roles.map((role) => {
                                                const roleInShift = shift.roles.find((r) => r.roleId === role.id);
                                                const isRoleSelected = !!roleInShift;

                                                return (
                                                    <label key={role.id} style={{ backgroundColor: role.color }} className={styles.roleLabel}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isRoleSelected}
                                                            className={styles.rolesCheckbox}
                                                            onChange={(e) => {
                                                                const updatedRoles = isRoleSelected
                                                                    ? shift.roles.filter((r) => r.roleId !== role.id)
                                                                    : [...shift.roles, { roleId: role.id, quantity: 1 }];

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
                                    </>
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
                <CustomButton icon="circleInfo" writing="" action={() => setIsInstructionOpen(true)} />
                <Instruction
                    isOpen={isInstructionOpen}
                    onClose={() => setIsInstructionOpen(false)}
                />
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
};
export default RequirementsForm;