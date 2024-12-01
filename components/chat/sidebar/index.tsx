import React, { useState, useEffect } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import AuthorizedImage from '@/components/chat/authorizedImage';
import Language from '@/components/types/language';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface SidebarProps {
    selectedLanguage: string;
    setSelectedLanguage: (setSelectedLanguage: string) => void;
    languages: Language[];
    selectedChat: ChatPartner | null;
    setSelectedChat: (chatPartner: ChatPartner | null) => void;
    setNewChat: (newChat: boolean) => void;
    chatType: 'user' | 'group';
    setChatType: (chatType: 'user' | 'group') => void;
    chatPartners: ChatPartner[];
    loading: (loading: boolean) => void;
    fetchChatHistory: (selectedChat: ChatPartner, language: string) => void;
    setError: (errorMessage: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedLanguage, setSelectedLanguage, languages, selectedChat, setSelectedChat, setNewChat, chatType, setChatType, chatPartners, loading, fetchChatHistory, setError }) => {
    const handleNewIndividualChat = () => {
        loading(true);
        setNewChat(true);
        setSelectedChat(null);
        loading(false);
    };

    const handleNewGroupChat = () => {
        loading(true);
        setNewChat(true);
        setChatType('group');
        setSelectedChat(null);
        loading(false);
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        loading(true);
        const language = event.target.value;
        setSelectedLanguage(language);

        if (selectedChat) {
            fetchChatHistory(selectedChat, language);
        }
        loading(false);
    };

    return (
        <>
            <div className={styles.sidebarHeader}>
                <div className={styles.headerTop}>
                    <span>Translate: </span>
                    <select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className={styles.languageSelect}
                    >
                        <option value="">None</option>
                        {languages.map((language) => (
                            <option key={language.code} value={language.code}>
                                {language.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.headerBottom}>
                    <div className={styles.sectionSelector}>
                        <div
                            onClick={() => setChatType('user')}
                            className={`${styles.sectionBlock} ${chatType === 'user' ? styles.activeSection : ''}`}
                        >
                            <FontAwesomeIcon icon={faUser} /> Individual
                        </div>

                        <div
                            onClick={() => setChatType('group')}
                            className={`${styles.sectionBlock} ${chatType === 'group' ? styles.activeSection : ''}`}
                        >
                            <FontAwesomeIcon icon={faUsers} /> Groups
                        </div>
                    </div>

                </div>
                {chatType === 'user' && (
                    <div>
                        <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewIndividualChat} />
                        New individual
                    </div>
                )}

                {chatType === 'group' && (
                    <div>
                        <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewGroupChat} />
                        New group
                    </div>
                )}
            </div>
            <ul className={styles.chatList}>
                {chatPartners.map((partner) => (
                    <li
                        key={partner.id}
                        className={`${styles.chatItem} ${selectedChat === partner ? styles.activeChat : ''}`}
                        onClick={() => fetchChatHistory(partner, selectedLanguage)}
                    >
                        {partner.photo ? (
                            <AuthorizedImage
                                src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${partner.photo}`}
                                setError={setError}
                            />
                        ) : (
                            <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                        )}
                        <div>
                            <p className={styles.chatName}>{partner.name}</p>
                            <p className={styles.lastMessage}>{partner.lastMessage || 'Brak wiadomości'}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Sidebar;
