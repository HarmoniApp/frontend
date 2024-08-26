import Language from './language';

export default interface PersonTile {
    id: number;
    firstname: string;
    surname: string;
    languages: Language[];
  }