// // import React from "react";
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import styles from "./main.module.scss";

// // interface CustomButtonProps {
// //     icon: string;
// //     writing: string;
// //     action: () => void;
// // }

// // const CustomButton: React.FC<CustomButtonProps> = ({ icon, writing, action }) => {
// //     return (
// //         <button className={styles.customButton} onClick={action}>
// //             <FontAwesomeIcon icon={icon as any} /> {writing}
// //         </button>
// //     );
// // };

// // export default CustomButton;


// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { IconProp, IconName } from "@fortawesome/fontawesome-svg-core";
// import styles from "./main.module.scss";

// interface CustomButtonProps {
//   icon: string; // Przekazujemy nazwę ikony jako string
//   writing: string;
//   action: () => void;
// }

// const CustomButton: React.FC<CustomButtonProps> = ({ icon, writing, action }) => {
//   // Rzutowanie string na IconName
//   const iconProp: IconProp = ["fas", icon as IconName];
//   console.log(iconProp);

//   return (
//     <button className={styles.customButton} onClick={action}>
//       <FontAwesomeIcon icon={iconProp} /> {writing}
//     </button>
//   );
// };

// export default CustomButton;


'use client';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import styles from "./main.module.scss";

const Icons = {
    userPlus: faUserPlus,
    cloudArrowDown: faCloudArrowDown
};

interface CustomButtonProps {
    icon: keyof typeof Icons;
    writing: string;
    action: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ icon, writing, action }) => {
    const IconComponent = Icons[icon];

    return (
        <button className={styles.customButton} onClick={action}>
            <FontAwesomeIcon icon={IconComponent} /> {writing}
        </button>
    );
};

export default CustomButton;