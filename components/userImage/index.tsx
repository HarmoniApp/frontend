import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from "next/image";
import UserDefaultPhoto from '@/assets/photo/default.jpg';
import GroupDefaultPhoto from '@/assets/photo/groupPhoto.png';

import styles from './main.module.scss';
import { fetchImage } from '@/services/imageService';
import LoadingSpinner from '../loadingSpinner';

interface UserImageProps {
  userId: number;
  type?: 'user' | 'group';
}

const UserImage: React.FC<UserImageProps> = ({ userId, type }) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchImage(userId, setUserPhoto);
    }
    loadData();
  }, [userId]);

  if (!userPhoto) {
    return <Image src={UserDefaultPhoto} alt="Default User Photo" className={styles.customImage} />;
  }
  if (type === 'group') {
    return <Image src={GroupDefaultPhoto} alt="Default Group Photo" className={styles.customImage} />;
  }

  return userPhoto ? (
    <img src={userPhoto} alt="User photo" className={styles.customImage} />
  ) : (
    <LoadingSpinner wholeModal={false}/>
  );
};
export default UserImage;