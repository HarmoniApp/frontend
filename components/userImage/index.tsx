import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from "next/image";
import UserDefaultPhoto from '@/assets/photo/default.jpg';
import GroupDefaultPhoto from '@/assets/photo/groupPhoto.png';

import styles from './main.module.scss';

interface UserImageProps {
    userId: number;
    type?: 'user' | 'group';
}

const UserImage: React.FC<UserImageProps> = ({ userId, type }) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const fetchImage = async (userId: number) => {
    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      if (!tokenJWT) {
        throw new Error('Token JWT not found in session storage');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}/photo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user photo: ${response.statusText}`);
      }

      const blob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      setUserPhoto(imageObjectUrl);
    } catch (error) {
      console.error('Error while fetching user photo:', error);
    }
  };

  useEffect(() => {
     fetchImage(userId);
  }, [userId]);

  if (!userPhoto) {
    return <Image src={UserDefaultPhoto} alt="Default User Photo" className={styles.customImage}/>;
  }
  if(type === 'group'){
    return <Image src={GroupDefaultPhoto} alt="Default Group Photo" className={styles.customImage}/>;

  }

  return  userPhoto ? (
    <img src={userPhoto} alt="User photo" className={styles.customImage}/>
  ) : (
    <ProgressSpinner className={styles.spinnerChatImage}/>
  );
};
export default UserImage;