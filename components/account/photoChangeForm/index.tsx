import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { patchPhoto } from '@/services/imageService';
import { Formik, Form } from 'formik';

import styles from './main.module.scss';
import { photoValidationSchema } from '@/validationSchemas/photoValidationSchema';

export const PhotoChangeForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const initialValues = {
        file: null,
    };

    const handleSubmit = async (values: { file: File | null }) => {
        const formData = new FormData();
        if (values.file) {
            formData.append('file', values.file);
        }
        patchPhoto(formData),
            onClose();
    };

    return (
        <div className={styles.photoChangeContainerMain}>
            <div className={styles.header}>
                <h2 className={styles.title}>Prześlij nowe zdjęcie</h2>
                <button onClick={onClose} className={styles.closeButton}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={photoValidationSchema}
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
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>Prześlij</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};