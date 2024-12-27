'use client';
import React from 'react';
import ChatPartner from '@/components/types/chatPartner';
import Language from '@/components/types/language';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faLanguage } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import NewConversationForm from '../newConversationForm';
import UserImage from '@/components/userImage';
import CustomButton from '@/components/customButton';

interface SidebarProps {
    selectedLanguage: string;
    setSelectedLanguage: (setSelectedLanguage: string) => void;
    languages: Language[];
    selectedChat: ChatPartner | null;
    // setSelectedChat: (chatPartner: ChatPartner | null) => void;
    setSelectedChat:  React.Dispatch<React.SetStateAction<ChatPartner | null>>;
    newChat: boolean;
    setNewChat: (newChat: boolean) => void;
    setChatType: (chatType: 'user' | 'group') => void;
    chatPartners: ChatPartner[];
    setLoading: (loading: boolean) => void;
    fetchChatHistory: (selectedChat: ChatPartner, language?: string) => void;
    setChatPartners: (chatPartners: ChatPartner[]) => void;
    loadChatPartners: (selectFirstPartner: boolean) => void;
    handleSelectUser: (user: ChatPartner) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedLanguage, setSelectedLanguage, languages, selectedChat, setSelectedChat, newChat, setNewChat, setChatType, chatPartners, setLoading, fetchChatHistory, setChatPartners, loadChatPartners, handleSelectUser }) => {
    const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLoading(true);
        const language = event.target.value;
        setSelectedLanguage(language);
        if (selectedChat) {
            await fetchChatHistory(selectedChat, language);
        }
        setLoading(false);
    };

    return (
        <>
            <div className={styles.sidebarHeader}>
                <CustomButton icon="plus" writing="Dodaj chat/grupę" action={() => { setNewChat(true); }} additionalClass='atChat'/>
            </div>
            <ul className={styles.chatList}>
                {chatPartners.map((partner) => (
                    <li
                        key={partner.id}
                        className={`${styles.chatItem} ${selectedChat === partner ? styles.activeChat : ''}`}
                        onClick={async () => {
                            setSelectedChat(partner);
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
                            setChatType={setChatType}
                            setNewChat={setNewChat}
                            chatPartners={chatPartners}
                            setChatPartners={setChatPartners}
                            setSelectedChat={setSelectedChat}
                            fetchChatHistory={fetchChatHistory}
                            loadChatPartners={loadChatPartners}
                            setLoading={setLoading}
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