import { calculateShiftDuration } from "@/utils/shifts/calculateShiftDuration";
import { newDayFormat } from "@/utils/shifts/formatShiftDate";
import { shiftHours } from "@/utils/shifts/generateShiftHours";
import { shiftValidationSchema } from "@/validationSchemas/shiftValidationSchema";
import { faArrowTurnUp, faCalendarXmark, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, ErrorMessage, Field } from "formik";
import styles from './main.module.scss';
import Shift from "@/components/types/shift";
import PredefinedShift from "@/components/types/predefinedShifts";
import Role from "@/components/types/role";

interface EditShiftFormProps {
    shift: Shift;
    predefineShifts: PredefinedShift[];
    roles: Role[];
    firstName: string;
    surname: string;
    onEditShift: (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => void;
    onClose: () => void;
    setIsDeleteConfirmOpen: (isOpen: boolean) => void;
}

export const EditShiftForm: React.FC<EditShiftFormProps> = ({
    shift,
    predefineShifts,
    roles,
    firstName,
    surname,
    onEditShift,
    onClose,
    setIsDeleteConfirmOpen
}) => {
    return (
        <Formik
            initialValues={{
                selectedRole: shift.role_name || '',
                selectedStartTime: shift.start.split('T')[1].slice(0, 5),
                selectedEndTime: shift.end.split('T')[1].slice(0, 5),
            }}
            validationSchema={shiftValidationSchema}
            onSubmit={(values) => {
                const newStart = `${shift.start.split('T')[0]}T${values.selectedStartTime}`;
                const newEnd = `${shift.end.split('T')[0]}T${values.selectedEndTime}`;

                onEditShift({
                    id: shift.id,
                    start: newStart,
                    end: newEnd,
                    userId: shift.user_id,
                    roleName: values.selectedRole,
                });

                onClose();
            }}
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <Form onSubmit={handleSubmit} className={styles.editShiftForm}>
                    <div className={styles.titleContainer}>
                        <label className={styles.title}>Edytuj zmianę</label>
                    </div>
                    <div className={styles.basicInfoContainer}>
                        <div className={styles.personFullnameContainer}>
                            <div className={styles.fullNameContainer}>
                                <label className={styles.fullNameLabel}>Imię i Nazwisko:</label>
                            </div>
                            <div className={styles.fullNameParagraphContainer}>
                                <p className={styles.firstnameParagraph}>{firstName}</p>
                                <p className={styles.surnameParagraph}>{surname}</p>
                            </div>
                        </div>
                        <div className={styles.dayContainer}>
                            <div className={styles.dayLabelContainer}>
                                <label className={styles.dayLabel}>Data:</label>
                            </div>
                            <div className={styles.dayParagraphContainer}>
                                <p className={styles.dayParagraph}>{newDayFormat(shift)}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.hoursContainerMain}>
                        <div className={styles.hourInfoContainer}>
                            <label className={styles.hourInfoLabel}>Godziny:</label>
                        </div>
                        <div className={styles.hoursContainer}>
                            <div className={styles.startHour}>
                                <label className={styles.startHourLabel}>Początek zmiany:
                                    <ErrorMessage name="selectedStartTime" component="div" className={styles.errorMessage} />
                                </label>
                                <Field as="select" name="selectedStartTime" className={styles.hourSelect}>
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
                                <Field as="select" name="selectedEndTime" className={styles.hourSelect}>
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
                        <label className={styles.shiftTimeLabel}>Czas trwania zmiany: {calculateShiftDuration(values.selectedStartTime, values.selectedEndTime)}h.</label>
                    </div>
                    <div className={styles.predefinedShiftsContainer}>
                        {predefineShifts.map((predefinedShift) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setFieldValue('selectedStartTime', predefinedShift.start.slice(0, 5));
                                    setFieldValue('selectedEndTime', predefinedShift.end.slice(0, 5));
                                }}
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
                        <Field as="select" name="selectedRole" className={styles.roleSelect}>
                            <option value="" disabled>Wybierz rolę</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </Field>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="button" className={styles.closeButton} onClick={onClose}>
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                            <p className={styles.buttonParagraph}>Cofnij</p>
                        </button>
                        <button type="button" className={styles.deleteShiftButton} onClick={() => setIsDeleteConfirmOpen(true)}>
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarXmark} />
                            <p className={styles.buttonParagraph}>Usuń zmianę</p>
                        </button>
                        <button type="submit" className={styles.addShiftButton}>
                            <FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarPlus} />
                            <p className={styles.buttonParagraph}>Edytuj zmianę</p>
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}