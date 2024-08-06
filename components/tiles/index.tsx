import React from 'react';
import styles from './main.module.scss';

const languageAbbreviations: { [key: string]: string } = {
  "German": "GER",
  "Spanish": "SPA",
  "Japanese": "JPN",
  "Polish": "POL",
  "English": "ENG"
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

const LanguageTile: React.FC<LanguageTileProps> = ({ person }) => {
  return (
    <div className={styles.tile}>
      <div className={styles.name}>{`${person.firstname} ${person.surname}`}</div>
      <div className={styles.languages}>
        {person.languages.map((language, index) => (
          <span key={index} className={styles.language}>{languageAbbreviations[language.name]}</span>
        ))}
      </div>
    </div>
  );
}

export default LanguageTile;
