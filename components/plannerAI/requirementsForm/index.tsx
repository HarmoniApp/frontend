import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Instruction from '@/components/plannerAI/instruction';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import CustomButton from '@/components/customButton';
import classNames from 'classnames';
import { planerAiValidationSchema } from '@/validationSchemas/planerAiValidationSchema';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import PredefineShiftsAndRoles from './preShiftsAndRoles';
import useRequirementsForm from '@/hooks/useRequirementsForm';

const RequirementsForm: React.FC = () => {
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);

    const {
        forms,
        setForms,
        predefineShifts,
        roles,
        loading,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        formRefs,
        handleAddForm,
        handleRemoveForm,
        handleEditDate,
        handleSubmit,
        handleRevoke,
    } = useRequirementsForm();

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