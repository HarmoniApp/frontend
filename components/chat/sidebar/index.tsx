'use client';
import React from 'react';
import ChatPartner from '@/components/types/chatPartner';
import Language from '@/components/types/language';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faLanguage } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import NewConversationForm from '../newConversationForm';
import UserImage from '@/components/userImage';

interface SidebarProps {
    selectedLanguage: string;
    setSelectedLanguage: (setSelectedLanguage: string) => void;
    languages: Language[];
    selectedChat: ChatPartner | null;
    setSelectedChat: (chatPartner: ChatPartner | null) => void;
    newChat: boolean;
    setNewChat: (newChat: boolean) => void;
    chatType: 'user' | 'group';
    setChatType: (chatType: 'user' | 'group') => void;
    chatPartners: ChatPartner[];
    loading: (loading: boolean) => void;
    fetchChatHistory: (selectedChat: ChatPartner, language: string) => void;
    userId: number;
    setChatPartners: (chatPartners: ChatPartner[]) => void;
    fetchChatHistoryForm: (partner: ChatPartner) => void;
    loadChatPartners: (selectFirstPartner: boolean) => void;
    handleSelectUser: (user: ChatPartner) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedLanguage, setSelectedLanguage, languages, selectedChat, setSelectedChat, newChat, setNewChat, chatType, setChatType, chatPartners, loading, fetchChatHistory, userId, setChatPartners, fetchChatHistoryForm, loadChatPartners, handleSelectUser }) => {
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
                    onClick={() => { setNewChat(true); }}
                >
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
                        <div className={styles.imageContainer}>
                            <UserImage userId={partner.id} type={partner.type}/>
                        </div>
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
            {newChat && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <NewConversationForm
                            userId={userId}
                            setChatType={setChatType}
                            setNewChat={setNewChat}
                            chatPartners={chatPartners}
                            setChatPartners={setChatPartners}
                            setSelectedChat={setSelectedChat}
                            fetchChatHistory={fetchChatHistoryForm}
                            loadChatPartners={loadChatPartners}
                            loading={loading}
                            handleSelectUser={handleSelectUser}
                        />
                        <FontAwesomeIcon icon={faXmark} onClick={() => { setNewChat(false) }} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
