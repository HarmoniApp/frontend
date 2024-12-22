import React from 'react';
import ChatPartner from '@/components/types/chatPartner';
import { Formik, Form, Field } from 'formik';
import styles from './main.module.scss';
import { postGroup } from '@/services/chatService';
import { groupValidationSchema } from '@/validationSchemas/groupValidationSchema';

interface CreateGroupChatFormProps {
  setChatType: (type: 'user' | 'group') => void;
  setNewChat: (newChat: boolean) => void;
  chatPartners: ChatPartner[];
  setChatPartners: (chatPartners: ChatPartner[]) => void;
  setSelectedChat: (chatPartner: ChatPartner) => void;
  fetchChatHistory: (partner: ChatPartner) => void;
  loadChatPartners: (selectFirstPartner: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const CreateGroupChatForm: React.FC<CreateGroupChatFormProps> = ({ setChatType, setNewChat, chatPartners, setChatPartners, setSelectedChat, fetchChatHistory, loadChatPartners, setLoading }) => {
  const userId = Number(sessionStorage.getItem('userId'));

  const handleCreateGroup = async (values: { groupName: string }) => {
    setLoading(true);

    const groupData = {
      name: values.groupName,
      membersIds: [userId],
    };

    try {
      const newGroup = await postGroup(groupData);
      if (newGroup != undefined) {
        setChatType('group');
        loadChatPartners(false);
        setNewChat(false);
        setChatPartners([...chatPartners, newGroup]);
        setSelectedChat(newGroup);
        fetchChatHistory(newGroup);
      }
    } catch (error) {
      console.error('Error while creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ groupName: '' }}
      validationSchema={groupValidationSchema}
      onSubmit={handleCreateGroup}
    >
      {({ errors, touched }) => (
        <Form className={styles.newGroupForm}>
          <div>
            <Field
              name="groupName"
              type="text"
              placeholder="Nazwa grupy"
              className={`${styles.groupNameInput} ${errors.groupName && touched.groupName ? styles.errorInput : ''}`}
            />
            {errors.groupName && touched.groupName && <div className={styles.errorMessage}>{errors.groupName}</div>}
          </div>
          <button type="submit" className={styles.createGroupButton}>Utwórz grupę</button>
        </Form>
      )}
    </Formik>
  );
};
export default CreateGroupChatForm;