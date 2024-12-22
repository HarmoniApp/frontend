"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faPen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import classNames from 'classnames';
import styles from './main.module.scss';
import { formatTimeToHHMM } from '@/services/predefineShiftService';
import ConfirmationPopUp from '@/components/confirmationPopUp';
import { Tooltip } from 'primereact/tooltip';
import { predefineShiftValidationSchema } from '@/validationSchemas/predefineShiftValidationSchema';
import usePredefinedShifts from '@/hooks/usePredefineShifts';
import { wrapText } from '@/services/wrapText';

const PredefinedShifts = () => {
  const {
    predefineShifts,
    editingShiftId,
    setEditingShiftId,
    isDeleteModalOpen,
    deleteShiftId,
    setIsDeleteModalOpen,
    shiftHours,
    handleAddPredefineShift,
    handleEditPredefineShift,
    handleDeletePredefineShift,
    openDeleteModal,
  } = usePredefinedShifts();

  return (
    <div className={styles.predefinedShiftsContainerMain}>
      <div className={styles.showShiftMapContainer}>
        {predefineShifts.map((shift) => {
          const isTruncated = wrapText(shift.name, 15) !== shift.name;
          const elementId = `shiftName-${shift.id}`;

          return (
            <Formik
              key={shift.id}
              initialValues={{
                id: shift.id,
                name: shift.name,
                start: formatTimeToHHMM(shift.start || '00:00'),
                end: formatTimeToHHMM(shift.end || '00:00'),
              }}
              validationSchema={predefineShiftValidationSchema}
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
                            <p
                              className={styles.shiftNameParagraph}
                              data-pr-tooltip={shift.name}
                              data-pr-position="right"
                              id={elementId}
                              style={{
                                cursor: isTruncated ? 'pointer' : 'default',
                              }}
                            >
                              {wrapText(shift.name, 15)}
                            </p>
                            {isTruncated && (
                              <Tooltip target={`#${elementId}`} autoHide />
                            )}
                            <p className={styles.shiftTimeParagraph}>
                              {shift.start ? shift.start.slice(0, 5) : 'Brak godziny'} - {shift.end ? shift.end.slice(0, 5) : 'Brak godziny'}
                            </p>
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
                            <button type='button' className={styles.editButton} onClick={() => setEditingShiftId(shift.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button type='button' className={styles.removeButton} onClick={() => openDeleteModal(shift.id)}>
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
                          <ConfirmationPopUp
                            action={() => handleDeletePredefineShift(shift.id)}
                            onClose={() => setIsDeleteModalOpen(false)}
                            description={`Usunąć predefiniowaną zmianę o nazwie: ${shift.name}`}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          );
        })}
      </div>
      <Formik
        initialValues={{ name: '', start: '00:00', end: '00:00' }}
        validationSchema={predefineShiftValidationSchema}
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
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default PredefinedShifts;