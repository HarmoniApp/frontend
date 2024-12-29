import React, { useEffect } from 'react';
import { ChatPartner } from '@/components/types/chatPartner';
import { Message } from '@/components/types/message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import UserImage from '@/components/userImage';

interface ConversationProps {
    messages: Message[];
    chatType: 'user' | 'group';
    selectedChat: ChatPartner;
    setIsEditGroupModalOpen: (open: boolean) => void;
}

const Conversation: React.FC<ConversationProps> = ({ messages, chatType, selectedChat, setIsEditGroupModalOpen }) => {
    const userId = Number(sessionStorage.getItem('userId'));

    useEffect(() => {
        const chatMessagesContainer = document.querySelector(`.${styles.chatMessages}`);
        if (chatMessagesContainer) {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            {chatType === 'user' ? (
                <div className={styles.userChatHeader}>
                    <div className={styles.imageContainer}>
                        <UserImage userId={selectedChat.id} />
                    </div>
                    <h2>{selectedChat.name}</h2>
                </div>
            ) : (
                <div className={styles.groupChatHeader}>
                    <h2>{selectedChat.name}</h2>
                    <p></p>
                    <div onClick={() => setIsEditGroupModalOpen(true)} className={styles.editIcon}>
                        <FontAwesomeIcon icon={faUsersRectangle} className={styles.info} />
                    </div>
                </div>
            )}
            <div className={styles.chatMessages}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.sender_id === userId ? styles.selfMessage : styles.otherMessage}`}
                    >
                        {message.sender_id !== userId && (
                            <div className={styles.avatarAndNameContainer}>
                                <div className={styles.imageContainer}>
                                    <UserImage userId={message.sender_id} />
                                </div>
                                {selectedChat?.type === 'group' && (
                                    <span className={styles.groupSenderName}>
                                        {message.groupSenderName || 'Brak imienia'}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className={styles.messageContentContainer}>
                            <p className={styles.messageContent}>{message.content}</p>
                            <div className={styles.timeAndReadMessagesContainer}>
                                {message.sender_id === userId && message.is_read && (
                                    <FontAwesomeIcon icon={faCheckDouble} className={styles.readIcon} />
                                )}
                                <span className={styles.timestamp}>{message.sent_at}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default Conversation;