import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
          <h2>CZATY</h2>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
        </div>
        <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.icon} />
          <input type="text" placeholder="Wyszukaj pracownika lub grupę" disabled />
        </div>
        <ul className={styles.chatList}>
          <li className={`${styles.chatItem} ${styles.activeChat}`}>
            <div className={styles.chatAvatar}></div>
            <div>
              <p className={styles.chatName}>Michał Szybki</p>
              <p className={styles.chatMessage}>Witam. Załatwię to jak najsz...</p>
            </div>
          </li>
          <li className={styles.chatItem}>
            <div className={styles.chatAvatar}></div>
            <div>
              <p className={styles.chatName}>Mariola Nowak</p>
              <p className={styles.chatMessage}>Za tydzień mam urlop. Nie...</p>
            </div>
          </li>
          <li className={styles.chatItem}>
            <div className={styles.chatAvatar}></div>
            <div>
              <p className={styles.chatName}>Wszyscy</p>
              <p className={styles.chatMessage}>Karol: Uwaga dziś owocowy...</p>
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <div className={styles.chatAvatar}></div>
          <h2>Michał Szybki</h2>
        </div>
        <div className={styles.chatMessages}>
          <div className={`${styles.message} ${styles.otherMessage}`}>
            <div className={styles.messageAvatar}></div>
            <p>Hej, nie będzie mnie w piątek. Dałbyś radę zanieść dokumenty Marioli?</p>
          </div>
          <div className={`${styles.message} ${styles.highlightedMessage} ${styles.selfMessage}`}>
            <p>Której Marioli? Nowak czy Żak?</p>
          </div>
          <div className={`${styles.message} ${styles.otherMessage}`}>
            <div className={styles.messageAvatar}></div>
            <p>Marioli Nowak.</p>
          </div>
          <div className={`${styles.message} ${styles.highlightedMessage} ${styles.selfMessage}`}>
            <p>Jasne dostarczę.</p>
          </div>
        </div>
        <div className={styles.messageInputContainer}>
          <FontAwesomeIcon icon={faImage} className={styles.icon} />
          <input type="text" placeholder="Wpisz wiadomość" disabled />
          <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default Chat;