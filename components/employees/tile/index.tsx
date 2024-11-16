import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './main.module.scss';
import PersonTile from '@/components/types/personTile';
import Flag from 'react-flagkit';
interface LanguageTileProps {
  person: PersonTile;
  view: 'tiles' | 'list';
}

const Tile: React.FC<LanguageTileProps> = ({ person, view }) => {
  const router = useRouter()
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleClick = () => {
    router.push(`/employees/user/${person.id}`);
  };

  const tileClassName = view === 'tiles' ? styles.tileContainerMain : styles.listContainerMain;

  const maxVisibleFlags = 2;
  const visibleLanguages = view === 'tiles' && person.languages.length > maxVisibleFlags
    ? person.languages.slice(0, 1)
    : person.languages;

  const hiddenLanguages = view === 'tiles' && person.languages.length > maxVisibleFlags
    ? person.languages.slice(1)
    : [];

  useEffect(() => {
    const fetchImage = async () => {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${person.photo}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenJWT}`,
            }
          }
        );

        if (response.ok) {
          console.log("Zdjęcie pobrane pomyślnie", response);
          const blob = await response.blob();
          const imageObjectUrl = URL.createObjectURL(blob);
          setImageSrc(imageObjectUrl);
        } else {
          console.error("Błąd pobierania zdjęcia:", response.statusText);
        }
      } catch (error) {
        console.error("Błąd podczas żądania:", error);
      }
    };

    fetchImage();
  }, [person.photo]);

  if (!imageSrc) {
    return <div className={styles.spinnerContainer}><ProgressSpinner /></div>;
  }

  return (
    <div onClick={handleClick} className={tileClassName}>
      <div className={styles.employeeImageContainer}>
        <img className={styles.employeeImage} src={imageSrc} alt="User Photo" />
      </div>
      <div className={styles.fullNameContainer}>
        <label className={styles.fullNameParagraph}>{person.firstname}</label>
        <label className={styles.fullNameParagraph}>{person.surname}</label>
      </div>
      <div className={styles.languagesContainer}>
        {visibleLanguages.map((language, index) => (
          <Flag key={index} className={styles.languageFlag} country={language.code.toUpperCase()} />
        ))}

        {view === 'tiles' && hiddenLanguages.length > 0 && (
          <div className={styles.moreFlagsTooltip}>
            +{hiddenLanguages.length}
            <div className={styles.tooltipContent}
              style={{
                left: `${-20 * hiddenLanguages.length}px`
              }}>
              {hiddenLanguages.map((language, index) => (
                <Flag key={index} className={styles.languageFlag} country={language.code.toUpperCase()} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tile;