import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowTurnUp, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ProgressSpinner } from 'primereact/progressspinner';
import * as Yup from 'yup';
import AbsenceType from '@/components/types/absenceType';
import classNames from 'classnames';
import styles from './main.module.scss';

interface AbsenceEmployeesRequestProps {
    onClose: () => void;
    onSend: number;
    onRefresh: () => void;
}

const AbsenceEmployeesRequest: React.FC<AbsenceEmployeesRequestProps> = ({ onClose, onSend, onRefresh }) => {
    const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [modalCountdown, setModalCountdown] = useState(10);
    const [modalIsOpenLoading, setModalIsOpenLoading] = useState(false);

    useEffect(() => {
        const fetchAbsenceTypes = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence-type`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    },
                });
                const data = await response.json();
                setAbsenceTypes(data);
            } catch (error) {
                console.error('Error fetching absence types:', error);
            }
        };

        fetchAbsenceTypes();
    }, []);

    useEffect(() => {
        if (isSubmitted) {
            const countdownInterval = setInterval(() => {
                setModalCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(countdownInterval);
                        onClose();
                        onRefresh();
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [isSubmitted, onClose, onRefresh]);

    const validationSchema = Yup.object({
        absence_type_id: Yup.string().required('Pole wymagane'),
        start: Yup.date()
            .required('Pole wymagane')
            .min(new Date(), 'Data nie może być w przeszłości'),
        end: Yup.date()
            .required('Pole wymagane')
            .min(Yup.ref('start'), 'Data zakończenia nie może być przed datą rozpoczęcia'),
    });

    const calculateDaysDifference = (start: string, end: string): number => {
        if (!start || !end) return 0;
    
        const startDate = new Date(start);
        const endDate = new Date(end);
    
        if (endDate < startDate) return 0;
    
        let currentDate = new Date(startDate);
        let workdaysCount = 0;
    
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workdaysCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return workdaysCount;
    };
    

    return (
        <div>
            {isSubmitted ? (
                <div className={styles.addAbsenceNotificationContainerMain}>
                    <div className={styles.headerContainer}>
                        <label className={styles.headerLabel}>Wniosek złożony pomyślnie!</label>
                    </div>
                    <div className={styles.counterContainter}>
                        <p className={styles.counterParagraph}>Zamkniecie okna za:</p>
                        <div className={styles.counterTimerContainer}>
                            <label className={styles.highlightTimeLabel}>{modalCountdown}</label>
                            <label className={styles.counterTimerLabel}>sekund.</label>
                        </div>
                    </div>
                    <div className={styles.buttonConianer}>
                        <button className={styles.closeButton} onClick={() => { onClose(); onRefresh(); }}>
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faCircleXmark} />
                            <p className={styles.buttonParagraph}>Zamknij</p>
                        </button>
                    </div>
                </div>
            ) : (
                <Formik
                    initialValues={{
                        start: '',
                        end: '',
                        absence_type_id: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setModalIsOpenLoading(true);
                        try {
                            const tokenJWT = sessionStorage.getItem('tokenJWT');
                            const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${tokenJWT}`,
                                },
                                credentials: 'include',
                            });

                            if (resquestXsrfToken.ok) {
                                const data = await resquestXsrfToken.json();
                                const tokenXSRF = data.token;

                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/absence`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                                        'X-XSRF-TOKEN': tokenXSRF,
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        absence_type_id: values.absence_type_id,
                                        start: values.start,
                                        end: values.end,
                                        user_id: onSend,
                                    }),
                                });
                                if (!response.ok) {
                                    const errorData = await response.json();
                                    console.error('Failed to add absence: ', response.statusText);
                                    throw new Error(`Server error: ${errorData.message || 'Unknown error'}`);
                                }
                                setModalIsOpenLoading(false);
                                setIsSubmitted(true);
                                onRefresh();
                            } else {
                                console.error('Failed to fetch XSRF token, response not OK');
                            }
                        } catch (error) {
                            console.error('Error adding absence:', error);
                            throw error;
                        }
                    }}
                >
                    {({ values, errors, touched }) => {
                        const daysDifference = calculateDaysDifference(values.start, values.end);
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
                                    Ilość dni: {daysDifference}
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

                                {modalIsOpenLoading && (
                                    <div className={styles.loadingModalOverlay}>
                                        <div className={styles.loadingModalContent}>
                                            <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            )}
        </div>
    );
};
export default AbsenceEmployeesRequest;