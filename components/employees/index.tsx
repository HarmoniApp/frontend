import React, { useEffect, useState } from 'react';
import Tiles from '@/components/tiles';
import styles from './main.module.scss';

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

const IndexPage: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/user/simple')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      {data.map((person, index) => (
        <Tiles key={index} person={person} />
      ))}
    </div>
  );
}

export default IndexPage;