import React, { useState, useEffect } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import AuthorizedImage from '@/components/chat/authorizedImage';
import Language from '@/components/types/language';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faPlus, faLanguage } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import NewConversationForm from '../newConversationForm';

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
    userId: number;
    setChatPartners: (chatPartners: ChatPartner[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedLanguage, setSelectedLanguage, languages, selectedChat, setSelectedChat, setNewChat, chatType, setChatType, chatPartners, loading, fetchChatHistory, setError , userId, setChatPartners}) => {
    // const Sidebar: React.FC<SidebarProps> = ({ selectedLanguage, setSelectedLanguage, languages, selectedChat, setSelectedChat, setNewChat, chatPartners, loading, fetchChatHistory, setError }) => {
    const handleNewChat = () => {
        loading(true);
        setNewChat(true);
        setSelectedChat(null);
        loading(false);
    };

    // const handleNewGroupChat = () => {
    //     loading(true);
    //     setNewChat(true);
    //     setChatType('group');
    //     setSelectedChat(null);
    //     loading(false);
    // };

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
                <div
                    className={styles.newChatContainer}
                    onClick={handleNewChat}
                >
                    <NewConversationForm 
                    userId={userId}
                    setChatType={setChatType}
                    setNewChat={setNewChat}
                    chatPartners={chatPartners}
                    setChatPartners={setChatPartners}
                    setSelectedChat={setSelectedChat}
                    fetchChatHistory={fetchChatHistory}
                    loadChatPartnersGroups={loadChatPartners}
                    loading={loading}
                    setError={setError}
                    handleSelectUser={handleSelectUser}
                    />
                    <FontAwesomeIcon icon={faPlus} className={styles.addChatIcon} />
                    <label className={styles.newChatLabel}>Dodaj chat/grupę</label>
                </div>
            </div>
            <ul className={styles.chatList}>
                {chatPartners.map((partner) => (
                    <li
                        key={partner.id}
                        className={`${styles.chatItem} ${selectedChat === partner ? styles.activeChat : ''}`}
                        onClick={() => {
                            if (partner.type) {
                                setChatType(partner.type);
                            }
                            fetchChatHistory(partner, selectedLanguage);
                        }}
                    >
                        {partner.photo ? (
                            <AuthorizedImage
                                src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${partner.photo}`}
                                setError={setError}
                            />
                        ) : (
                            <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                        )}
                        <div className={styles.messagesTileInfo}>
                            <label className={styles.chatName}>{partner.name}</label>
                            <label className={styles.lastMessage}>
                                {partner.lastMessage
                                    ? partner.lastMessage.length > 25
                                        ? `${partner.lastMessage.slice(0, 25)}...`
                                        : partner.lastMessage
                                    : 'Brak wiadomości'}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.translateContainer}>
                <FontAwesomeIcon icon={faLanguage} />
                <span>Przetłumacz: </span>
                <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className={styles.languageSelect}
                >
                    <option value="">Oryginalny</option>
                    {languages.map((language) => (
                        <option key={language.code} value={language.code}>
                            {language.name}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default Sidebar;
