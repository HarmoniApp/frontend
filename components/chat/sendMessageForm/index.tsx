import React from 'react';
import ChatPartner from '@/components/types/chatPartner';
import Message from '@/components/types/message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { posChattMessage } from '@/services/chatService';

interface SendMessageFormProps {
    selectedChat: ChatPartner | null;
    setSelectedChat: (chatPartner: ChatPartner) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    userId: number;
    loadChatPartners: (selectFirstPartner: boolean) => void;
    selectedLanguage: string;
    loading: (loading: boolean) => void;
    setError: (errorMessage: string | null) => void;
}

const SendMessageForm: React.FC<SendMessageFormProps> = ({ selectedChat, setSelectedChat, messages, setMessages, userId, loadChatPartners, selectedLanguage, loading, setError }) => {

    const handleSendMessage = async (content: string, language: string = '') => {
        loading(true);

        if (content.trim() && selectedChat !== null) {
            var messageData;

            if (selectedChat.type == 'user') {
                messageData = {
                    sender_id: userId,
                    receiver_id: selectedChat.id,
                    content,
                    is_read: false,
                }
            } else {
                messageData = {
                    sender_id: userId,
                    group_id: selectedChat.id,
                    content,
                    is_read: false,
                }
            }

            try {
                await posChattMessage(messageData, setMessages, messages);

                loadChatPartners(true);
                setSelectedChat(selectedChat);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                loading(false);
            }
        }
    };

    const validationSchema = Yup.object({
        message: Yup.string()
            .required('Wiadomość nie może być pusta')
            .test('no-only-spaces', 'Wiadomość nie może zawierać tylko spacji', value => value ? value.trim().length > 0 : false)
    });

    return (
        <Formik
            initialValues={{ message: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                handleSendMessage(values.message, selectedLanguage);
                resetForm();
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnSubmit={true}
        >
            {({ errors, touched }) => (
                <Form className={styles.messageInputContainer}>
                    <Field
                        name="message"
                        type="text"
                        placeholder="Wpisz wiadomość"
                        className={`${styles.messageInput} ${errors.message && touched.message ? styles.errorInput : ''}`}
                    />
                    <button type="submit" className={styles.sendButton}>
                        <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />
                    </button>
                    {errors.message && touched.message && <div className={styles.errorMessage}>{errors.message}</div>}
                </Form>
            )}
        </Formik>
    );
};

export default SendMessageForm;
