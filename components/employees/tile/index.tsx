import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './main.module.scss';
import PersonTile from '@/components/types/personTile';
import Flag from 'react-flagkit';
interface LanguageTileProps {
  person: PersonTile;
  view: 'tiles' | 'list'; 
}

const Tile: React.FC<LanguageTileProps> = ({ person, view }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/employees/user/${person.id}`);
  };

  const tileClassName = view === 'tiles' ? styles.tileContainerMain : styles.listContainerMain;

  return (
    <div onClick={handleClick} className={tileClassName}>
      <div className={styles.fullNameContainer}>
        <p className={styles.fullNameParagraph}>{`${person.firstname} ${person.surname}`}</p>
      </div>
      <div className={styles.languagesContainer}>
        {person.languages.map((language, index) => (
          <Flag key={index} className={styles.languageFlag} country={language.code.toUpperCase()} />
        ))}
      </div>
    </div>
  );
}

export default Tile;
