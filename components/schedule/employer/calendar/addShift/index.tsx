import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp, faCalendarPlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import Role from '@/components/types/role';
import User from '@/components/types/user';
import PredefinedShifts from '@/components/types/predefinedShifts';
import classNames from 'classnames';
import styles from './main.module.scss';
import { fetchUserRoles } from '@/services/roleService';
import { fetchPredefinedShifts } from '@/services/predefineShiftService';
import { shiftValidationSchema } from '@/validationSchemas/shiftValidationSchema';
import { calculateShiftDuration } from '@/utils/shifts/calculateShiftDuration';
import { shiftHours } from '@/utils/shifts/generateShiftHours';

interface AddShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddShift: (shiftData: { start: string; end: string; userId: number; roleName: string }) => void;
    user: User;
    day: string;
}

const AddShiftModal: React.FC<AddShiftModalProps> = ({ isOpen, onClose, onAddShift, user, day }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [predefineShifts, setPredefineShifts] = useState<PredefinedShifts[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        const loadData = async () => {
            await fetchPredefinedShifts(setPredefineShifts);
            await fetchUserRoles(user.id, setRoles);
        }

        loadData();
    }, [isOpen, user.id]);

    const handlePredefinedShift = (predefinedShift: PredefinedShifts, setFieldValue: any) => {
        setFieldValue('selectedStartTime', predefinedShift.start.slice(0, 5));
        setFieldValue('selectedEndTime', predefinedShift.end.slice(0, 5));
    };

    return isOpen ? (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <Formik
                    initialValues={{
                        selectedRole: '',
                        selectedStartTime: '00:00',
                        selectedEndTime: '00:00',
                    }}
                    validationSchema={shiftValidationSchema}
                    onSubmit={(values) => {
                        const newStart = `${day}T${values.selectedStartTime}`;
                        const newEnd = `${day}T${values.selectedEndTime}`;

                        onAddShift({
                            start: newStart,
                            end: newEnd,
                            userId: user.id,
                            roleName: values.selectedRole,
                        });
                        onClose();
                    }}
                >
                    {({ handleSubmit, setFieldValue, errors, touched, values }) => (
                        <Form onSubmit={handleSubmit} className={styles.editShiftForm}>
                            <div className={styles.titleContainer}>
                                <label className={styles.title}>Dodaj zmianę</label>
                            </div>
                            <div className={styles.basicInfoContainer}>
                                <div className={styles.personFullnameContainer}>
                                    <div className={styles.fullNameContainer}>
                                        <label className={styles.fullNameLabel}>Imie i Nazwisko:</label>
                                    </div>
                                    <div className={styles.fullNameParagraphContainer}>
                                        <p className={styles.firstnameParagraph}>{user.firstname}</p>
                                        <p className={styles.surnameParagraph}>{user.surname}</p>
                                    </div>
                                </div>
                                <div className={styles.dayContainer}>
                                    <div className={styles.dayLabelContainer}>
                                        <label className={styles.dayLabel}>Data:</label>
                                    </div>
                                    <div className={styles.dayParagraphContainer}>
                                        <p className={styles.dayParagraph}>{day.split('-').reverse().join('.')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.hoursConstainerMain}>
                                <div className={styles.hourInfoContainer}>
                                    <label className={styles.hourInfoLabel}>Godziny:</label>
                                </div>
                                <div className={styles.hoursConstainer}>
                                    <div className={styles.startHour}>
                                        <label className={styles.startHourLabel}>Początek zmiany:
                                            <ErrorMessage name="selectedStartTime" component="div" className={styles.errorMessage} />
                                        </label>
                                        <Field
                                            as="select"
                                            name="selectedStartTime"
                                            className={classNames(styles.hourSelect, {
                                                [styles.errorInput]: errors.selectedStartTime && touched.selectedStartTime,
                                            })}
                                        >
                                            <option value="" disabled>Wybierz godzinę</option>
                                            {shiftHours.map((time, index) => (
                                                <option key={index} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                    <div className={styles.endHour}>
                                        <label className={styles.endHourLabel}>Koniec zmiany:
                                            <ErrorMessage name="selectedEndTime" component="div" className={styles.errorMessage} />
                                        </label>
                                        <Field
                                            as="select"
                                            name="selectedEndTime"
                                            className={classNames(styles.hourSelect, {
                                                [styles.errorInput]: errors.selectedEndTime && touched.selectedEndTime,
                                            })}
                                        >
                                            <option value="" disabled>Wybierz godzinę</option>
                                            {shiftHours.map((time, index) => (
                                                <option key={index} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.shiftTimeContainer}>
                                <label className={styles.shiftTimeLabel}>
                                    Czas trwania zmiany: {calculateShiftDuration(values.selectedStartTime, values.selectedEndTime)}h.
                                </label>
                            </div>
                            <div className={styles.predefinedShiftsContainer}>
                                {predefineShifts.map((predefinedShift) => (
                                    <button
                                        type="button"
                                        onClick={() => handlePredefinedShift(predefinedShift, setFieldValue)}
                                        key={predefinedShift.id}
                                        className={styles.predefinedShiftButton}
                                    >
                                        <p className={styles.predefinedShiftParagraph}>{predefinedShift.name}</p>
                                    </button>
                                ))}
                            </div>
                            <div className={styles.roleContainer}>
                                <label className={styles.roleLabel}>Rola na zmianie:
                                    <ErrorMessage name="selectedRole" component="div" className={styles.errorMessage} />
                                </label>
                                <Field
                                    as="select"
                                    name="selectedRole"
                                    className={classNames(styles.roleSelect, {
                                        [styles.errorInput]: errors.selectedRole && touched.selectedRole,
                                    })}
                                >
                                    <option value="" disabled>Wybierz rolę</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button className={styles.closeButton} type="button" onClick={onClose}>
                                    <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                                    <p className={styles.buttonParagraph}>Cofnij</p>
                                </button>
                                <button className={styles.addShiftButton} type="submit">
                                    <FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarPlus} />
                                    <p className={styles.buttonParagraph}>Dodaj zmianę</p>
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    ) : null;
};
export default AddShiftModal;