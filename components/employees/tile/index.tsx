import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './main.module.scss';
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
  Other: 'UN', 
  Persian: 'IR',
  Polish: 'PL', 
  Portuguese: 'PT', 
  Russian: 'RU',
  Spanish: 'ES', 
  Turkish: 'TR',
  Vietnamese: 'VN',
};

interface Language {
  id: number;
  name: string;
}

interface Person {
  id: number;
  firstname: string;
  surname: string;
  languages: Language[];
}

interface LanguageTileProps {
  person: Person;
}

const Title: React.FC<LanguageTileProps> = ({ person }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/employees/user/${person.id}`);
  };

  return (
    <div onClick={handleClick} className={styles.tile}>
      <div className={styles.name}>{`${person.firstname} ${person.surname}`}</div>
      <div className={styles.languages}>
        {person.languages.map((language, index) => (
          <Flag key={index} className={styles.language} country={languageAbbreviations[language.name]} />
        ))}
      </div>
    </div>
  );
}

export default Title;
