import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import PredefinedShift from '@/components/types/predefinedShifts';
import Role from '@/components/types/role';
import Instruction from '@/components/plannerAI/instruction';
import IRequirementsForm from '@/components/types/requirementsForm';
import styles from './main.module.scss';
import { fetchRoles } from '@/services/roleService';
import { fetchPredefinedShifts } from '@/services/predefineShiftService';
import LoadingSpinner from '@/components/loadingSpinner';
import { generateScheduleAi, revokeScheduleAi } from '@/services/planerAiService';
import CustomButton from '@/components/customButton';
import classNames from 'classnames';
import { planerAiValidationSchema } from '@/validationSchemas/planerAiValidationSchema';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import PredefineShiftsAndRoles from './preShiftsAndRoles';

const RequirementsForm: React.FC = () => {
    const [forms, setForms] = useState<IRequirementsForm[]>([
        { id: Date.now(), date: '', shifts: [] },
    ]);

    const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
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

    const handleAddForm = () => {
        setForms((prevForms) => [
            ...prevForms,
            { id: Date.now(), date: '', shifts: [] },
        ]);
    };

    const handleRemoveForm = (id: number) => {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
        formRefs.current = formRefs.current.filter((ref, index) => forms[index]?.id !== id);
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

            formRefs.current.forEach((formRef) => {
                formRef.resetForm();
            });
        } catch (error) {
            console.error('Wystąpił błąd przy wysyłaniu danych:', error);
        }
    };

    const handleRevoke = async () => {
        try {
            setIsConfirmationModalOpen(false);
            await revokeScheduleAi();
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

    const handleEditDate = (formId: number, value: string) => {
        setForms((prevForms) =>
            prevForms.map((form) =>
                form.id === formId ? { ...form, date: value } : form
            )
        );
    };

    return (
        <div className={styles.planerAiContainer}>
            {forms.map((form, index) => (
                <Formik
                    key={form.id}
                    initialValues={form}
                    validationSchema={planerAiValidationSchema}
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
                                                handleEditDate(form.id, e.target.value)
                                            }}
                                        />
                                    </label>
                                </>
                                <ErrorMessage name="date" component="div" className={styles.errorMessage} />
                            </div>
                            {errors.shifts && touched.shifts && (
                                <div className={styles.errorMessage}>
                                    {typeof errors.shifts === 'string'
                                        ? errors.shifts
                                        : 'Musisz wybrać przynajmniej jedną rolę'}
                                </div>
                            )}
                            <PredefineShiftsAndRoles 
                                predefineShifts={predefineShifts}
                                roles={roles}
                                values={values}
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                setForms={setForms}
                                form={form}
                            />
                            <CustomButton icon="trashCan" writing="Usuń dzień" action={() => handleRemoveForm(form.id)} />
                        </Form>
                    )}
                </Formik>
            ))}
            <div className={styles.buttonContainer}>
                <CustomButton icon="chartSimple" writing="Generuj" action={handleSubmit} />
                <CustomButton icon="plus" writing="Dodaj kolejny dzień" action={handleAddForm} />
                <CustomButton icon="eraser" writing="Usuń wszystkie zmiany ostatnio wprowadzone przez PlanerAi" action={() => setIsConfirmationModalOpen(true)} />
                <Instruction isOpen={isInstructionOpen} onClose={() => setIsInstructionOpen(false)} />
            </div>
            {loading && <LoadingSpinner />}
            {isConfirmationModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ConfirmationPopUp action={handleRevoke} onClose={() => setIsConfirmationModalOpen(false)} description={`Usunąć wszystkie ostatnio wygenerowane przez PlanerAi zmiany`} />
                    </div>
                </div>
            )}
        </div>
    );
};
export default RequirementsForm;