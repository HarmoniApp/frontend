import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './main.module.scss';
import PersonTile from '@/components/types/personTile';
import Flag from 'react-flagkit';

const languageAbbreviations: { [key: string]: string } = {
  Arabic: 'AE', 
  Bengali: 'BD', 
  English: 'GB', 
  French: 'FR', 
  German: 'DE', 
  Hindi: 'IN', 
  Italian: 'IT', 
  Japanese: 'JP', 
  Korean: 'KR', 
  Mandarin: 'CN', 
  Other: 'IL', 
  Persian: 'IR',
  Polish: 'PL', 
  Portuguese: 'PT', 
  Russian: 'RU',
  Spanish: 'ES', 
  Turkish: 'TR',
  Vietnamese: 'VN',
};

interface LanguageTileProps {
  person: PersonTile;
}

const Title: React.FC<LanguageTileProps> = ({ person }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/employees/user/${person.id}`);
  };

  return (
    <div onClick={handleClick} className={styles.tileContainerMain}>
      <div className={styles.fullNameContainer}>
        <p className={styles.fullNameParagraph}>{`${person.firstname} ${person.surname}`}</p>
      </div>
      <div className={styles.languagesContainer}>
        {person.languages.map((language, index) => (
          <Flag key={index} className={styles.languageFlag} country={languageAbbreviations[language.name]} />
        ))}
      </div>
    </div>
  );
}

export default Title;
