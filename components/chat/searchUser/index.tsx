import React, { useState } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import styles from './main.module.scss';
import '@/styles/main.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import UserImage from '@/components/userImage';
import { fetchUserSearch } from '@/services/chatService';

interface SearchUserProps {
  handleSelectUser: (user: ChatPartner) => void;
  groupChat: boolean;
  setChatType?: (type: 'user' | 'group') => void
}

const SearchUser: React.FC<SearchUserProps> = ({ handleSelectUser, groupChat, setChatType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ChatPartner[]>([]);

  const customClass = groupChat ? styles.searchGroupUserContaner : styles.searchPrivUserContaner;

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    await fetchUserSearch(query, setSearchResults)
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
      </div>
      <div className={styles.searchUserResult}>
        {searchResults.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className={styles.searchUserResultItem}
          >
            <div className={styles.imageContainer}>
              <UserImage userId={user.id} />
            </div>
            <label className={styles.fullNameLabel}>{user.name}</label>
          </div>
        ))}
      </div>
      {loading && <ProgressSpinner className="spinnerChatImage" />}
    </div>
  );
};

export default SearchUser;
