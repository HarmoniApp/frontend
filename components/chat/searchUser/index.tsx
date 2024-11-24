import React, { useState } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import AuthorizedImage from '@/components/chat/authorizedImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface SearchUserProps {
  // onSearchResults: (results: ChatPartner[]) => void;
  handleSelectUser: (user: ChatPartner) => void;
  groupChat: boolean;
}

const SearchUser: React.FC<SearchUserProps> = ({ handleSelectUser, groupChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ChatPartner[]>([]);

  const customClass = groupChat ? styles.searchGroupUserContaner : styles.searchPrivUserContaner;

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    if (query.trim().length > 2) {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/search?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      const data = await response.json();
      const results = data.map((user: any) => ({
        id: user.id,
        name: user.firstname + " " + user.surname,
        photo: user.photo,
        type: 'user'
      }));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setLoading(false);
  };

  return (
    <div className={customClass}>
      <div className={styles.searchUserInputContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Wyszukaj użytkownika ..."
          className={styles.searchInput}
        />
        {/* <FontAwesomeIcon icon={faSearch} className={styles.icon}/> */}
      </div>
      <div className={styles.searchUserResult}>
        {searchResults.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className={styles.searchUserResultItem}
          >
            <div className={styles.userImageContainer}>
              {user.photo ? (
                <AuthorizedImage
                  src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className={styles.defaultAvatarIcon} />
              )}
            </div>
            <label className={styles.fullNameLabel}>{user.name}</label>
          </div>
        ))}
      </div>
      {/* <ul className={styles.searchResults}>
            {searchResults.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={styles.searchResultItem}
              >
                {user.photo ? (
                  <AuthorizedImage
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                    alt="User Photo"
                    className={styles.chatAvatar}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className={styles.defaultAvatarIcon} />
                )}
                <p>{user.name}</p>
              </li>
            ))}
          </ul> */}
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default SearchUser;
