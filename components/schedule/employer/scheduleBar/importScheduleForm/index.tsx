import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form } from 'formik';

import styles from './main.module.scss';
import { importEmployeesOrScheduleValidationSchema } from '@/validationSchemas/importEmployeesValidationSchema';
import { importScheduleXLSX } from '@/services/xlsxService';
import CustomButton from '@/components/customButton';

export const ImportScheduleForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const initialValues = {
        file: null,
    };

    const handleSubmit = async (values: { file: File | null }) => {
        const formData = new FormData();
        if (values.file) {
            formData.append('file', values.file);
        }
        await importScheduleXLSX(formData);
        onClose();
        await new Promise((resolve) => setTimeout(resolve, 3000)); 
        window.location.reload();
    };

    return (
        <div className={styles.importScheduleContainerMain}>
            <div className={styles.header}>
                <h2 className={styles.title}>Importuj harmonogram</h2>
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
            <p>*po pomyślnym dodaniu nastąpi odświeżenie strony</p>
            <CustomButton
                icon="faDownload"
                writing="Pobierz szablon pliku"
                action={() => {
                    const fileUrl = "/template import schedule.xlsx";
                    window.location.href = fileUrl;
                }}
            />
        </div>
    );
};