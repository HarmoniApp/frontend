'use client';
import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import LoadingSpinner from '@/components/loadingSpinner';
import { patchPhoto } from '@/services/imageService';

interface PhotoChangeProps {
    onClose: () => void;
}

const PhotoChange: React.FC<PhotoChangeProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const initialValues = {
        file: null,
    };

    const validationSchema = Yup.object({
        file: Yup.mixed()
            .required('Plik jest wymagany')
            .test(
                'fileSize',
                'Plik za duży, maksymalny rozmiar to 2MB',
                (value) => value instanceof File && value.size <= 2 * 1024 * 1024
            )
            .test(
                'fileFormat',
                'Niedozwolony format pliku, dozwolone formaty to: .jpeg, .png',
                (value) =>
                    value instanceof File &&
                    ['image/jpeg', 'image/png'].includes(value.type)
            ),
    });


    const handleSubmit = async (values: { file: File | null }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (values.file) {
                formData.append('file', values.file);
            }
            await patchPhoto(formData)
        } catch (error) {
            console.error('Error uploading photo: ', error);
        } finally {
            setLoading(false);
            onClose();
        }
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
                            <label className={styles.fileLabel}>Wybierz plik</label>
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
                        {fileName && <button className={styles.fileName} role="presentation">Wybrany plik: {fileName}</button>}
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Przesyłanie...' : 'Prześlij'}
                        </button>
                        <ErrorMessage name="file" component="div" className={styles.errorMessage} />
                    </Form>
                )}
            </Formik>
            {loading && (
                // <div className={styles.loadingModalOverlay}>
                //     <div className={styles.loadingModalContent}>
                //         <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                //     </div>
                // </div>
                <LoadingSpinner />
            )}
        </div>
    );
};

export default PhotoChange;