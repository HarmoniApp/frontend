import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';

interface AuthorizedImageProps {
    src: string;
    alt?: string;
    className?: string;
}

const AuthorizedImage: React.FC<AuthorizedImageProps> = ({ src, alt, className }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const tokenJWT = sessionStorage.getItem('tokenJWT');
                if (!tokenJWT) {
                    console.error('Brak tokena JWT');
                    return;
                }

                const response = await fetch(src, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenJWT}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać obrazu');
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (error) {
                console.error('Błąd podczas pobierania obrazu:', error);
            }
        };

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [src]);

    return imageUrl ? <img src={imageUrl} alt={alt} className={className} /> : <div className={styles.spinnerContainer}><ProgressSpinner /></div>;
};

export default AuthorizedImage;