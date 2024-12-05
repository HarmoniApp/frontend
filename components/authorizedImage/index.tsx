import React, { useEffect, useState } from 'react';
import Image from "next/image";
import UserPhoto from '@/assets/photo/default.jpg';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';
import '@/styles/main.css';

interface AuthorizedImageProps {
    src: string;
}

const AuthorizedImage: React.FC<AuthorizedImageProps> = ({ src }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const tokenJWT = sessionStorage.getItem('tokenJWT');
                if (!tokenJWT) {
                    console.error('Brak tokena JWT');
                    setHasError(true);
                    return;
                }

                const response = await fetch(src, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenJWT}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        console.error('Obraz nie został znaleziony (404)');
                        setHasError(true);
                    } else {
                        throw new Error(`Błąd HTTP: ${response.status}`);
                    }
                    return;
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (error) {
                console.error('Błąd podczas pobierania obrazu:', error);
                setHasError(true);
            }
        };

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [src]);

    if (hasError) {
        return <Image src={UserPhoto} alt="Default User Photo" className={styles.customImage}/>;
    }
    
    return imageUrl ? (
        <img src={imageUrl} alt="User Photo" className={styles.customImage} />
    ) : (
        <ProgressSpinner className="spinnerChatImage" />
    );
};
export default AuthorizedImage;