import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp, faCalendarXmark, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import Role from '@/components/types/role';
import Shift from '@/components/types/shift';
import PredefinedShifts from '@/components/types/predefinedShifts';
import styles from './main.module.scss';
import { fetchUserRoles } from '@/services/roleService';
import { fetchPredefinedShifts } from '@/services/predefineShiftService';

interface EditShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditShift: (shiftData: { id: number; start: string; end: string; userId: number; roleName: string; }) => void;
  onDeleteShift: (shiftId: number, userId: number) => void;
  shift: Shift;
  firstName: string;
  surname: string;
  setLoading: (loading: boolean) => void;
}

const EditShift: React.FC<EditShiftModalProps> = ({ isOpen, onClose, onEditShift, onDeleteShift, shift, firstName, surname, setLoading }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [predefineShifts, setPredefineShifts] = useState<PredefinedShifts[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPredefinedShifts(setPredefineShifts);
      await fetchUserRoles(shift.user_id, setRoles);
      setLoading(false);
  }

  loadData();
  }, [shift.user_id]);

  const validationSchema = Yup.object({
    selectedRole: Yup.string().required('Pole wymagane'),
    selectedStartTime: Yup.string()
      .required('Pole wymagane')
      .test('not-equal', 'Brak chronologii', function (value) {
        const { selectedEndTime } = this.parent;
        return value !== selectedEndTime;
      }),
    selectedEndTime: Yup.string()
      .required('Pole wymagane')
      .test('not-equal', 'Brak chronologii', function (value) {
        const { selectedStartTime } = this.parent;
        return value !== selectedStartTime;
      }),
  });

  const shiftHours: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      shiftHours.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const shiftTime = (startTime: string, endTime: string) => {
    const convertTimeToDecimal = (time: string) => {
      const [hours, minutes] = time.split(':');
      return parseInt(hours) + parseInt(minutes) / 60;
    };

    const start = convertTimeToDecimal(startTime);
    const end = convertTimeToDecimal(endTime);
    const duration = start <= end ? end - start : 24 - start + end;

    return isNaN(duration) ? 0 : duration;
  };

  const newDayFormat = () => {
    return shift.start.split('T')[0].replace(/-/g, '.').split('.').reverse().join('.');
  };

  const handlePredefinedShift = (predefinedShift: PredefinedShifts, setFieldValue: any) => {
    setFieldValue('selectedStartTime', predefinedShift.start.slice(0, 5));
    setFieldValue('selectedEndTime', predefinedShift.end.slice(0, 5));
  };

  const handleDeleteShift = (shiftId: number, userId: number) => {
    setIsDeleteConfirmOpen(true);
  }

  const confirmDeleteShift = (shiftId: number, userId: number) => {
    onDeleteShift(shiftId, userId);
    setIsDeleteConfirmOpen(false);
    onClose();
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {isDeleteConfirmOpen ? (
          <div className={styles.deleteContainerMain}>
            <div className={styles.headerContainer}>
              <label className={styles.highlightTitle}>Czy na pewno chcesz usunąć tę zmianę?</label>
              <div className={styles.infoContainer}>
                <label className={styles.headerLabel}>{firstName} {surname}</label>
                <label className={styles.highlight}>{newDayFormat()}</label>
              </div>
            </div>
            <div className={styles.butonContainter}>
              <button className={styles.closeButton} onClick={() => setIsDeleteConfirmOpen(false)}>
                <FontAwesomeIcon className={styles.buttonIcon} icon={faArrowTurnUp} style={{ transform: 'rotate(-90deg)' }} />
                <p className={styles.buttonParagraph}>Cofnij</p>
              </button>
              <button className={styles.deleteButton} onClick={() => confirmDeleteShift(shift.id, shift.user_id)}>
                <FontAwesomeIcon className={styles.buttonIcon} icon={faCalendarXmark} />
                <p className={styles.buttonParagraph}>Usuń zmianę</p>
              </button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{
              selectedRole: shift.role_name || '',
              selectedStartTime: shift.start.split('T')[1].slice(0, 5),
              selectedEndTime: shift.end.split('T')[1].slice(0, 5),
            }}
            validationSchema={validationSchema}
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
                      <p className={styles.dayParagraph}>{newDayFormat()}</p>
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
                  <label className={styles.shiftTimeLabel}>Czas trwania zmiany: {shiftTime(values.selectedStartTime, values.selectedEndTime)}h.</label>
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
                  <button type="button" className={styles.deleteShiftButton} onClick={() => handleDeleteShift(shift.id, shift.user_id)}>
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
        )}
      </div>
    </div>
  );
};

export default EditShift;