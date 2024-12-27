import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { fetchAbsenceTypes, postAbsence } from '@/services/absenceService';
import AbsenceType from '@/components/types/absenceType';
import classNames from 'classnames';
import styles from './main.module.scss';
import { absenceValidationSchema } from '@/validationSchemas/absenceValidationSchema';
import { calculateWorikngDays } from '@/utils/holidayCalculator';
interface AbsenceEmployeesRequestFormProps {
    onClose: () => void;
    onSend: number;
    onRefresh: () => void;
}

export const AbsenceEmployeesRequestForm: React.FC<AbsenceEmployeesRequestFormProps> = ({ onClose, onSend, onRefresh }) => {
    const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchAbsenceTypes(setAbsenceTypes);
        };
        fetchData();
    }, []);

    const handleAddAbsence = async (values: any) => {
        try {
            onClose();
            await postAbsence(values, onSend)
            onRefresh();
        } catch (error) {
            console.error('Error adding absence:', error);
        } 
    };

    return (
        <div>
            <Formik
                initialValues={{
                    start: '',
                    end: '',
                    absence_type_id: ''
                }}
                validationSchema={absenceValidationSchema}
                onSubmit={handleAddAbsence}
            >
                {({ values, errors, touched }) => {
                    return (
                        <Form className={styles.absenceForm}>
                            <div className={styles.formTitle}>
                                <label className={styles.title}>Złóż wniosek o urlop</label>
                            </div>

                            <label className={styles.dataLabel}>
                                Wybierz powód urlopu
                                <ErrorMessage name="absence_type_id" component="div" className={styles.errorMessage} />
                            </label>
                            <Field
                                as="select"
                                className={classNames(styles.formInput, styles.formSelect, styles.pointer, {
                                    [styles.errorInput]: errors.absence_type_id && touched.absence_type_id,
                                })}
                                name="absence_type_id"
                            >
                                <option className={styles.defaultOption} value="" disabled>Wybierz rodzaj urlopu</option>
                                {absenceTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Field>

                            <label className={styles.dataLabel}>
                                Data rozpoczęcia
                                <ErrorMessage name="start" component="div" className={styles.errorMessage} />
                            </label>
                            <Field
                                type="date"
                                name="start"
                                className={classNames(styles.formInput, styles.pointer, {
                                    [styles.errorInput]: errors.start && touched.start,
                                })}
                            />

                            <label className={styles.dataLabel}>
                                Data zakończenia
                                <ErrorMessage name="end" component="div" className={styles.errorMessage} />
                            </label>
                            <Field
                                type="date"
                                name="end"
                                className={classNames(styles.formInput, styles.pointer, {
                                    [styles.errorInput]: errors.end && touched.end,
                                })}
                            />

                            <label className={styles.quantityOfDaysLabel}>
                                Ilość dni: {calculateWorikngDays(values.start, values.end)}
                            </label>

                            <div className={styles.buttonContainer}>
                                <button className={styles.backButton} type="button" onClick={onClose}>
                                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                                    <p className={styles.buttonParagraph}>Cofnij</p>
                                </button>
                                <button className={styles.addButton} type="submit">
                                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleCheck} />
                                    <p className={styles.buttonParagraph}>Złóż wniosek</p>
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};