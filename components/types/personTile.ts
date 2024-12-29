import { Language } from '@/components/types/language';
export interface PersonTile {
  id: number;
  firstname: string;
  surname: string;
  languages: Language[];
  photo: string;
}