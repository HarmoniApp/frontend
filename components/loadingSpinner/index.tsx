import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';

const LoadingSpinner: React.FC = () => {
    return (
        <div className={styles.loadingModalOverlay}>
            <div className={styles.loadingModalContent}>
                <div className={styles.spinnerContainer}><ProgressSpinner /></div>
            </div>
        </div>
    )
}
export default LoadingSpinner;