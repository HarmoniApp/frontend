import ConfirmationPopUp from "@/components/confirmationPopUp";
import { wrapText } from "@/utils/wrapText";
import { faCheck, faXmark, faPen, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Tooltip } from "primereact/tooltip";
import styles from './main.module.scss';
import { PredefinedShift } from "@/components/types/predefinedShifts";
import { predefineShiftValidationSchema } from "@/validationSchemas/predefineShiftValidationSchema";
import { formatTimeToHHMM } from "@/services/predefineShiftService";

interface EditPredefineShiftFormProps {
  predefineShift: PredefinedShift,
  editingShiftId: number | null,
  setEditingShiftId: (id: number | null) => void,
  isDeleteModalOpen: boolean,
  deleteShiftId: number | null,
  setIsDeleteModalOpen: (isOpen: boolean) => void,
  shiftHours: string[],
  handleEditPredefineShift: (values: PredefinedShift, { resetForm }: any) => void,
  handleDeletePredefineShift: (id: number) => void,
  openDeleteModal: (id: number) => void,
}

export const EditPredefineShiftForm: React.FC<EditPredefineShiftFormProps> = ({
  predefineShift,
  editingShiftId,
  setEditingShiftId,
  isDeleteModalOpen,
  deleteShiftId,
  setIsDeleteModalOpen,
  shiftHours,
  handleEditPredefineShift,
  handleDeletePredefineShift,
  openDeleteModal,
}) => {
  const isTruncated = wrapText(predefineShift.name, 15) !== predefineShift.name;
  const elementId = `shiftName-${predefineShift.id}`;

  return (
    <Formik
      key={predefineShift.id}
      initialValues={{
        id: predefineShift.id,
        name: predefineShift.name,
        start: formatTimeToHHMM(predefineShift.start || '00:00'),
        end: formatTimeToHHMM(predefineShift.end || '00:00'),
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
                {editingShiftId === predefineShift.id ? (
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
                      data-pr-tooltip={predefineShift.name}
                      data-pr-position="right"
                      id={elementId}
                      style={{
                        cursor: isTruncated ? 'pointer' : 'default',
                      }}
                    >
                      {wrapText(predefineShift.name, 15)}
                    </p>
                    {isTruncated && (
                      <Tooltip target={`#${elementId}`} autoHide />
                    )}
                    <p className={styles.shiftTimeParagraph}>
                      {predefineShift.start ? predefineShift.start.slice(0, 5) : 'Brak godziny'} - {predefineShift.end ? predefineShift.end.slice(0, 5) : 'Brak godziny'}
                    </p>
                  </>
                )}
              </div>
              <div className={styles.editAndRemoveButtonContainer}>
                {editingShiftId === predefineShift.id ? (
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
                    <button type='button' className={styles.editButton} onClick={() => setEditingShiftId(predefineShift.id)}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button type='button' className={styles.removeButton} onClick={() => openDeleteModal(predefineShift.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {isDeleteModalOpen && deleteShiftId === predefineShift.id && (
            <>
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <ConfirmationPopUp
                    action={() => handleDeletePredefineShift(predefineShift.id)}
                    onClose={() => setIsDeleteModalOpen(false)}
                    description={`Usunąć predefiniowaną zmianę o nazwie: ${predefineShift.name}`}
                  />
                </div>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}
