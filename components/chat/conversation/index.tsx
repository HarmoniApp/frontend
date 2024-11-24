import React, { useEffect } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import Message from '@/components/types/message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthorizedImage from '@/components/chat/authorizedImage';
import { faEye, faUsers, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';

interface ConversationProps {
    userId: number;
    messages: Message[];
    chatType: 'user' | 'group';
    selectedChat: ChatPartner;
    setIsEditGroupModalOpen: (open: boolean) => void;
}

const Conversation: React.FC<ConversationProps> = ({ userId, messages, chatType, selectedChat, setIsEditGroupModalOpen }) => {

    useEffect(() => {
        const chatMessagesContainer = document.querySelector(`.${styles.chatMessages}`);
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className={styles.chatHeader}>
                {selectedChat.photo ? (
                    <AuthorizedImage
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${selectedChat.photo}`}
                    />
                ) : (
                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                )}
                <h2>{selectedChat.name}</h2>
                {chatType === 'group' && (
                    <div onClick={() => setIsEditGroupModalOpen(true)} className={styles.editIcon}>
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                )}
            </div>
            <div className={styles.chatMessages}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.sender_id === userId ? styles.selfMessage : styles.otherMessage
                            } ${message.is_read ? styles.readMessage : styles.unreadMessage}`}
                    >
                        {message.sender_id !== userId && (
                            <div className={styles.messageAvatar}>
                                {message.groupSenderPhoto || selectedChat.photo ? (
                                    <AuthorizedImage
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${message.groupSenderPhoto || selectedChat.photo}`}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                                )}
                            </div>
                        )}
                        {message.sender_id !== userId && selectedChat?.type === 'group' && (
                            <span>{message.groupSenderName}</span>
                        )}
                        <p>{message.content}</p>
                        <span className={styles.timestamp}>{message.sent_at}</span>
                        {message.sender_id === userId && message.is_read && (
                            <FontAwesomeIcon icon={faEye} className={styles.readIcon} />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Conversation;
