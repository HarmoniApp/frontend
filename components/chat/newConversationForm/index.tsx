import React from 'react';
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
    loadChatPartners: (selectFirstPartner: boolean) => void;
    setLoading: (loading: boolean) => void;
    handleSelectUser: (user: ChatPartner) => void;
}
const NewConversationForm: React.FC<NewConversationFormProps> = ({ userId, setChatType, setNewChat, chatPartners, setChatPartners, setSelectedChat, fetchChatHistory, loadChatPartners, setLoading, handleSelectUser }) => {

    return (
        <div className={styles.newConversationForm}>
            <div className={styles.userNewConversation}>
                <label className={styles.newConversationLabel}>Nowy indywidualny czat</label>
                <SearchUser handleSelectUser={handleSelectUser} groupChat={false} setChatType={setChatType} />
            </div>
            <div className={styles.groupNewConversation}>
                <label className={styles.newConversationLabel}>Nowy czat grupowy</label>
                <CreateGroupChatForm
                    userId={userId}
                    setChatType={setChatType}
                    setNewChat={setNewChat}
                    chatPartners={chatPartners}
                    setChatPartners={setChatPartners}
                    setSelectedChat={setSelectedChat}
                    fetchChatHistory={fetchChatHistory}
                    loadChatPartners={loadChatPartners}
                    setLoading={setLoading}
                />
            </div>
        </div>
    );
};
export default NewConversationForm;