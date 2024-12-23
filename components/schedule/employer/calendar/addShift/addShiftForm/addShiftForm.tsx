import { calculateShiftDuration } from "@/utils/shifts/calculateShiftDuration";
import { shiftHours } from "@/utils/shifts/generateShiftHours";
import { shiftValidationSchema } from "@/validationSchemas/shiftValidationSchema";
import { faArrowTurnUp, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Formik, Form, ErrorMessage, Field } from "formik";
import styles from './main.module.scss';
import User from "@/components/types/user";
import PredefinedShift from "@/components/types/predefinedShifts";
import Role from "@/components/types/role";

interface AddShiftModalProps {
    onClose: () => void;
    onAddShift: (shiftData: { start: string; end: string; userId: number; roleName: string }) => void;
    user: User;
    day: string;
    predefineShifts: PredefinedShift[];
    roles: Role[];
}

export const AddShiftForm: React.FC<AddShiftModalProps> = ({
    onClose,
    onAddShift,
    user,
    day,
    predefineShifts,
    roles }) => {

    return (
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
    );
}