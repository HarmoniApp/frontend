import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';

interface LoadingSpinnerProps {
    wholeModal?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({wholeModal}) => {
    return (
        <>
            {wholeModal ? (
                <div className={styles.loadingModalOverlay}>
                    <div className={styles.loadingModalContent}>
                        <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                    </div>
                </div>
            ) : (
                <div className={styles.spinnerContainer}><ProgressSpinner /></div>
            )}
        </>
    )
}
export default LoadingSpinner;