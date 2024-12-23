'use client';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCloudArrowDown, faCloudArrowUp,faCalendar, faUser, faComments, faPlane, faRobot, faCalendarCheck, faChevronLeft, faChevronRight, faChartSimple, faPlus, faEraser, faCircleInfo, faTrashCan, faCalendarMinus, faCalendarPlus, faArrowTurnUp, faSquareCheck, faUserLock, faUserMinus, faUserPen, faArrowRightToBracket, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";

const Icons = {
    userPlus: faUserPlus,
    cloudArrowDown: faCloudArrowDown,
    cloudArrowUp: faCloudArrowUp,
    calendar: faCalendar,
    user: faUser,
    comments: faComments,
    plane: faPlane,
    robot: faRobot,
    calendarCheck: faCalendarCheck,
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
    trashCan: faTrashCan,
    chartSimple: faChartSimple,
    plus: faPlus,
    calendarMinus: faCalendarMinus,
    calendarPlus: faCalendarPlus,
    eraser: faEraser,
    circleInfo: faCircleInfo,
    arrowTurnUp: faArrowTurnUp,
    squareCheck: faSquareCheck,
    userLock: faUserLock,
    userMinus: faUserMinus,
    userPen: faUserPen,
    arrowRightToBracket: faArrowRightToBracket,
    floppyDisk: faFloppyDisk,
};
interface CustomButtonProps {
    icon: keyof typeof Icons;
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