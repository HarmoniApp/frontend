import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import SearchUser from '../searchUser';
import CreateGroupChatForm from '../createGroupChatForm';
import ChatPartner from '@/components/types/chatPartner';

interface NewConversationFormProps {
    userId: number;
    setChatType: (type: 'user' | 'group') => void;
    setNewChat: (newChat: boolean) => void;
    chatPartners: ChatPartner[];
    setChatPartners: (chatPartners: ChatPartner[]) => void;
    setSelectedChat: (chatPartner: ChatPartner) => void;
    fetchChatHistory: (partner: ChatPartner) => void;
    loadChatPartnersGroups: (selectFirstPartner: boolean) => void;
    loading: (loading: boolean) => void;
    setError: (errorMessage: string | null) => void;
    handleSelectUser: (user: ChatPartner) => void;
    onClose: () => void;
}
const NewConversationForm: React.FC<NewConversationFormProps> = ({ userId, setChatType, setNewChat, chatPartners, setChatPartners, setSelectedChat, fetchChatHistory, loadChatPartnersGroups, loading, setError, handleSelectUser, onClose }) => {
console.log('NewConversationFormProps', onClose);
    return (
        <div className={styles.newConversationForm}>
            <div className={styles.userNewConversation}>
                <label className={styles.newConversationLabel}>New Individual Chat</label>
                <SearchUser handleSelectUser={handleSelectUser} groupChat={false} setChatType={setChatType} setError={setError} />
            </div>
            <div className={styles.groupNewConversation}>
                <label className={styles.newConversationLabel}>New Group Chat</label>
                <CreateGroupChatForm
                    userId={userId}
                    setChatType={setChatType}
                    setNewChat={setNewChat}
                    chatPartners={chatPartners}
                    setChatPartners={setChatPartners}
                    setSelectedChat={setSelectedChat}
                    fetchChatHistory={fetchChatHistory}
                    loadChatPartnersGroups={loadChatPartnersGroups}
                    loading={loading}
                    setError={setError}
                />
            </div>
            <FontAwesomeIcon icon={faXmark} onClick={onClose} className={styles.closeIcon} />
        </div>
    );
};
export default NewConversationForm;