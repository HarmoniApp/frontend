"use client";
import React from 'react';
import styles from './main.module.scss';
import EditGroup from '@/components/chat/editGroup';
import { SendMessageForm } from '@/components/chat/sendMessageForm';
import Conversation from '@/components/chat/conversation';
import Sidebar from '@/components/chat/sidebar';
import LoadingSpinner from '../loadingSpinner';
import { useChatManagement } from '@/hooks/chat/useChatManagement';

const Chat = () => {
  const {
    chatPartners,
    setChatPartners,
    selectedChat,
    setSelectedChat,
    messages,
    languages,
    selectedLanguage,
    setSelectedLanguage,
    newChat,
    setNewChat,
    chatType,
    setChatType,
    isEditGroupModalOpen,
    setIsEditGroupModalOpen,
    loading,
    setLoading,
    handleSelectUser,
    loadChatPartners,
    fetchChatHistory,
  } = useChatManagement();

  return (
    <div className={styles.chatContainer}>
      <>
        <div className={styles.sidebar}>
          <Sidebar selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={languages}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            newChat={newChat}
            setNewChat={setNewChat}
            setChatType={setChatType}
            chatPartners={chatPartners}
            setLoading={setLoading}
            fetchChatHistory={fetchChatHistory}
            setChatPartners={setChatPartners}
            loadChatPartners={loadChatPartners}
            handleSelectUser={handleSelectUser}
          />
        </div>
        <div className={styles.chatWindow}>
          {selectedChat && (
            <>
              <Conversation
                messages={messages}
                chatType={chatType}
                selectedChat={selectedChat}
                setIsEditGroupModalOpen={setIsEditGroupModalOpen}
              />
              <SendMessageForm
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                loadChatPartners={loadChatPartners}
                selectedLanguage={selectedLanguage}
                loading={setLoading}
              />
            </>
          )}
        </div>
      </>
      {isEditGroupModalOpen && (
        <EditGroup
          editGroupModal={setIsEditGroupModalOpen}
          selectedChat={selectedChat}
          setLoading={setLoading}
          setIsEditGroupModalOpen={setIsEditGroupModalOpen}
        />
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default Chat;