import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUserPlus, faCloudArrowDown, faCloudArrowUp,faCalendar, faUser, faComments, faPlane, faRobot, faCalendarCheck, faChevronLeft, faChevronRight, faChartSimple, faPlus, faEraser, faCircleInfo, faTrashCan, faCalendarMinus, faCalendarPlus, faArrowTurnUp, faSquareCheck, faUserLock, faUserMinus, faUserPen, faArrowRightToBracket, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export const Icons: Record<string, IconDefinition> = {
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

export type IconKeys = keyof typeof Icons;