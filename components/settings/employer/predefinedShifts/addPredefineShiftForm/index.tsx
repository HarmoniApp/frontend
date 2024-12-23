import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import styles from './main.module.scss';
import { Formik, Form, ErrorMessage, Field } from "formik"
import { predefineShiftValidationSchema } from "@/validationSchemas/predefineShiftValidationSchema";
import { formatTimeToHHMM } from "@/services/predefineShiftService";
import { shiftHours } from "@/utils/shifts/generateShiftHours";

interface AddPredefineShiftFormProps {
    handleAddPredefineShift: (values: any, { resetForm }: any) => void;
}

export const AddPredefineShiftForm: React.FC<AddPredefineShiftFormProps> = ({ handleAddPredefineShift }) => {
    return (
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
    )
}