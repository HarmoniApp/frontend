"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import PredefinedShift from '@/components/types/predefinedShifts';
import AddNotification from '../popUps/addNotification';
import DeleteConfirmation from '../popUps/deleteConfirmation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import styles from './main.module.scss';
import { formatTimeToHHMM, fetchPredefinedShifts, deletePredefineShift, postPredefineShift, putPredefineShift } from '@/services/predefineShiftService';
import LoadingSpinner from '@/components/loadingSpinner';

const PredefinedShifts = () => {
  const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addedPredefineShiftName, setAddedPredefineShiftName] = useState<string>('');
  const [deleteShiftId, setDeleteShiftId] = useState<number | null>(null);
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);

  const openDeleteModal = (shiftId: number) => {
    setDeleteShiftId(shiftId);
    setIsDeleteModalOpen(true);
  };

  const shiftHours: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      shiftHours.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchPredefinedShifts(setPredefineShifts);
    }

    loadData();
  }, []);

  const handleAddPredefineShift = async (values: any, { resetForm }: any) => {
    setModalIsOpenLoadning(true);

    try {
      await postPredefineShift(values, setPredefineShifts);

      // setAddedPredefineShiftName(dataPost.name);
      setIsAddModalOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error adding predefine shift:', error);
      throw error;
    } finally {
      setModalIsOpenLoadning(false);
    }
  };

  const handleEditPredefineShift = async (values: PredefinedShift, { resetForm }: any) => {
    setModalIsOpenLoadning(true);
    try {
      await putPredefineShift(values, setPredefineShifts);

      setEditingShiftId(null);
      resetForm();
    }
    catch (error) {
      console.error("Error updating predefine shift:", error);
    } finally {
      setModalIsOpenLoadning(false);
    }
  };

  const handleDeletePredefineShift = async (shiftId: number) => {
    await deletePredefineShift(shiftId, setPredefineShifts)
  };

  const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
  };

  const shiftValidationSchema = Yup.object({
    name: Yup.string()
      .required('Pole wymagane')
      .test('no-invalid-chars', function (value) {
        const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9\s]*$/);
        return invalidChars.length === 0
          ? true
          : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
      }),
    start: Yup.string()
      .required('Wybierz godzinę rozpoczęcia')
      .test('start-before-end', 'Brak chronologii', function (start, context) {
        const { end } = context.parent;
        return start !== end;
      }),
    end: Yup.string()
      .required('Wybierz godzinę zakończenia')
      .test('start-before-end', 'Brak chronologii', function (end, context) {
        const { start } = context.parent;
        return start !== end;
      }),
  });


  return (
    <div className={styles.predefinedShiftsContainerMain}>
      <div className={styles.showShiftMapContainer}>
        {predefineShifts.map((shift) => (
          <Formik
            key={shift.id + shift.name + shift.start + shift.end}
            initialValues={{
              id: shift.id,
              name: shift.name,
              start: formatTimeToHHMM(shift.start || '00:00'),
              end: formatTimeToHHMM(shift.end || '00:00'),
            }}
            validationSchema={shiftValidationSchema}
            onSubmit={handleEditPredefineShift}
          >
            {({ handleSubmit, handleChange, values, errors, touched, resetForm }) => (
              <Form onSubmit={handleSubmit}>
                <div className={styles.showShiftContainerMain}>
                  <ErrorMessage name="name" component="div" className={styles.errorMessage} />
                  <ErrorMessage name="start" component="div" className={styles.errorMessage} />
                  <ErrorMessage name="end" component="div" className={styles.errorMessage} />
                  <div className={styles.showShiftContainer}>
                    <div className={styles.shiftInfoContainer}>
                      {editingShiftId === shift.id ? (
                        <>
                          <Field
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            className={classNames(styles.formInput, {
                              [styles.errorInput]: errors.name && touched.name,
                            })}
                          />
                        </>
                      ) : (
                        <>
                          <p className={styles.shiftNameParagraph}>{shift.name}</p>
                          <p className={styles.shiftTimeParagraph}>{shift.start ? shift.start.slice(0, 5) : 'Brak godziny'} - {shift.end ? shift.end.slice(0, 5) : 'Brak godziny'}</p>

                        </>
                      )}
                    </div>
                    <div className={styles.editAndRemoveButtonContainer}>
                      {editingShiftId === shift.id ? (
                        <>
                          <Field
                            as="select"
                            name="start"
                            value={formatTimeToHHMM(values.start)}
                            onChange={handleChange}
                            className={classNames(styles.shiftTimeSelect, {
                              [styles.errorInput]: errors.start && touched.start,
                            })}
                          >
                            {shiftHours.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </Field>
                          <Field
                            as="select"
                            name="end"
                            value={formatTimeToHHMM(values.end)}
                            onChange={handleChange}
                            className={classNames(styles.shiftTimeSelect, {
                              [styles.errorInput]: errors.end && touched.end,
                            })}
                          >
                            {shiftHours.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </Field>
                          <button className={styles.yesButton} type="submit">
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            type="button"
                            className={styles.noButton}
                            onClick={() => {
                              resetForm();
                              setEditingShiftId(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className={styles.editButton} onClick={() => setEditingShiftId(shift.id)}>
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button className={styles.removeButton} onClick={() => openDeleteModal(shift.id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isDeleteModalOpen && deleteShiftId === shift.id && (
                  <>
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent}>
                        <DeleteConfirmation
                          onClose={() => setIsDeleteModalOpen(false)}
                          onDelete={() => handleDeletePredefineShift(shift.id)}
                          info={shift.name}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
        ))}
      </div>
      <Formik
        initialValues={{ name: '', start: '00:00', end: '00:00' }}
        validationSchema={shiftValidationSchema}
        onSubmit={handleAddPredefineShift}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form className={styles.addContainer} onSubmit={handleSubmit}>
            <Field
              name="name"
              value={values.name}
              onChange={handleChange}
              className={classNames(styles.formInput, {
                [styles.errorInput]: errors.name && touched.name,
              })}
              placeholder="Wpisz nazwę predefiniowanej zmiany"
            />
            <ErrorMessage name="name" component="div" className={styles.errorMessage} />
            <Field
              as="select"
              name="start"
              value={formatTimeToHHMM(values.start)}
              onChange={handleChange}
              className={classNames(styles.addShiftTimeSelect, {
                [styles.errorInput]: errors.start && touched.start,
              })}
            >
              {shiftHours.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Field>
            <ErrorMessage name="start" component="div" className={styles.errorMessage} />
            <Field
              as="select"
              name="end"
              value={formatTimeToHHMM(values.end)}
              onChange={handleChange}
              className={classNames(styles.addShiftTimeSelect, {
                [styles.errorInput]: errors.end && touched.end,
              })}
            >
              {shiftHours.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Field>
            <ErrorMessage name="end" component="div" className={styles.errorMessage} />
            <button className={styles.addButton} type="submit">
              <FontAwesomeIcon icon={faPlus} />
            </button>

            {isAddModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <AddNotification onClose={() => setIsAddModalOpen(false)} info={addedPredefineShiftName} />
                </div>
              </div>
            )}

            {modalIsOpenLoadning && (
              // <div className={styles.loadingModalOverlay}>
              //   <div className={styles.loadingModalContent}>
              //     <div className={styles.spinnerContainer}><ProgressSpinner /></div>
              //   </div>
              // </div>
              <LoadingSpinner />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default PredefinedShifts;