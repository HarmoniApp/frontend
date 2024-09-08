"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import PredefinedShift from '@/components/types/predefinedShifts';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import styles from './main.module.scss';

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

const PredefinedShifts: React.FC = () => {
  const [shifts, setShifts] = useState<PredefinedShift[]>([]);
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

  const shiftHours: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      shiftHours.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  useEffect(() => {
    fetchPredefinedShifts();
  }, []);

  const fetchPredefinedShifts = () => {
    fetch('http://localhost:8080/api/v1/predefine-shift')
      .then(response => response.json())
      .then(data => setShifts(data))
      .catch(error => console.error('Error fetching predefined shifts:', error));
  };

  const handleDeleteShift = (shiftId: number) => {
    fetch(`http://localhost:8080/api/v1/predefine-shift/${shiftId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setShifts(shifts.filter((shift) => shift.id !== shiftId));
        } else {
          console.error('Failed to delete shift');
        }
      })
      .catch(error => console.error('Error deleting shift:', error));
  };

  return (
    <div className={styles.predefinedShiftsContainerMain}>
      <div className={styles.showShiftMapContainer}>
        {shifts.map((shift) => (
          <Formik
            key={shift.id}
            initialValues={{ name: shift.name, start: shift.start.slice(0, 5), end: shift.end.slice(0, 5) }}
            validationSchema={shiftValidationSchema}
            onSubmit={(values, { resetForm }) => {
              fetch(`http://localhost:8080/api/v1/predefine-shift/${shift.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
              })
                .then(response => response.json())
                .then((data: PredefinedShift) => {
                  setShifts(shifts.map(s => (s.id === data.id ? data : s)));
                  setEditingShiftId(null);
                  resetForm();
                })
                .catch(error => console.error('Error updating shift:', error));
            }}
          >
            {({ handleSubmit, handleChange, values, errors, touched, resetForm }) => (
              <form onSubmit={handleSubmit}>
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
                          <p className={styles.shiftTimeParagraph}>{shift.start.slice(0, 5)} - {shift.end.slice(0, 5)}</p>
                        </>
                      )}
                    </div>
                    <div className={styles.editAndRemoveButtonContainer}>
                      {editingShiftId === shift.id ? (
                        <>
                          <Field
                            as="select"
                            name="start"
                            value={values.start}
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
                            value={values.end}
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
                          <button className={styles.removeButton} onClick={() => handleDeleteShift(shift.id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        ))}
      </div>
      <Formik
        initialValues={{ name: '', start: '00:00', end: '00:00' }}
        validationSchema={shiftValidationSchema}
        onSubmit={(values, { resetForm }) => {
          fetch('http://localhost:8080/api/v1/predefine-shift', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then(response => response.json())
            .then((data: PredefinedShift) => {
              setShifts([...shifts, data]);
              resetForm();
            })
            .catch(error => console.error('Error adding shift:', error));
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form className={styles.addContainer} onSubmit={handleSubmit}>
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
              value={values.start}
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
              value={values.end}
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
          </form>
        )}
      </Formik>
    </div>
  );
};
export default PredefinedShifts;