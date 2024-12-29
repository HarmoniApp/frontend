'use client';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconKeys, Icons } from '@/components/types/icons';
import styles from "./main.module.scss";

interface CustomButtonProps {
    icon: IconKeys;
    writing: string;
    action?: () => void;
    additionalClass?: string;
    typeButton?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<CustomButtonProps> = ({ icon, writing, action, additionalClass, typeButton="button"}) => {
    const IconComponent = Icons[icon];
    const cutomClass = `${styles.customButton} ${additionalClass ? styles[additionalClass] : styles.atNormal}`;
    return (
        <button className={cutomClass} onClick={action} type={typeButton}>
            <FontAwesomeIcon icon={IconComponent} className={styles.icon}/> {writing}
        </button>
    );
};
export default CustomButton;