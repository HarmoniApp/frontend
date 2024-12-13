import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { patchPhoto } from '@/services/imageService';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';

const PhotoChange: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const initialValues = {
        file: null,
    };

    const validationSchema = Yup.object({
        file: Yup.mixed()
            .required(() => {
                return toast.warning('Plik jest wymagany!');
            })
            .test('fileSize', (value) => {
                if (value instanceof File && value.size > 2 * 1024 * 1024) {
                    toast.warning('Plik za duży, maksymalny rozmiar to 2MB!');
                    return false;
                }
                return true;
            })
            .test('fileFormat', (value) => {
                if (value instanceof File && !['image/jpeg', 'image/png'].includes(value.type)) {
                    toast.warning('Niedozwolony format pliku. Dozwolone formaty to: .jpeg, .png!');
                    return false;
                }
                return true;
            }),
    });

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
                validationSchema={validationSchema}
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
export default PhotoChange;