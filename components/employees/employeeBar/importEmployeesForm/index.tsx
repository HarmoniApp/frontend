import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form } from 'formik';

import styles from './main.module.scss';
import { importEmployeesOrScheduleValidationSchema } from '@/validationSchemas/importEmployeesValidationSchema';
import { importUsersXLSX } from '@/services/xlsxService';

export const ImportEmployeesForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const initialValues = {
        file: null,
    };

    const handleSubmit = async (values: { file: File | null }) => {
        const formData = new FormData();
        if (values.file) {
            formData.append('file', values.file);
        }
        await importUsersXLSX(formData);
        onClose();
        await new Promise((resolve) => setTimeout(resolve, 3000)); 
        window.location.reload();
    };

    return (
        <div className={styles.importEmployeesContainerMain}>
            <div className={styles.header}>
                <h2 className={styles.title}>Importuj Pracowników</h2>
                <button onClick={onClose} className={styles.closeButton}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={importEmployeesOrScheduleValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className={styles.form}>
                        <label htmlFor="file" className={styles.uploadLabel}>
                            <FontAwesomeIcon icon={faUpload} className={styles.icon} />
                            {fileName ? (
                                <label className={styles.fileLabel}>{fileName}</label>
                            ) : (
                                <label className={styles.fileLabel}>Wybierz plik</label>
                            )}
                            <input
                                id="file"
                                name="file"
                                type="file"
                                className={styles.uploadInput}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                                    setFieldValue('file', file);
                                    setFileName(file ? file.name : null);
                                }}
                            />
                        </label>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>Importuj</button>
                    </Form>
                )}
            </Formik>
            <p>*po pomyślnym importowaniu zostanie wygenerowany i pobrany plik z loginami i hasłami</p>
        </div>
    );
};