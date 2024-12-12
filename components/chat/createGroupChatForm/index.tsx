import React from 'react';
import ChatPartner from '@/components/types/chatPartner';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';
import { postGroup } from '@/services/chatService';

interface CreateGroupChatFormProps {
  userId: number;
  setChatType: (type: 'user' | 'group') => void;
  setNewChat: (newChat: boolean) => void;
  chatPartners: ChatPartner[];
  setChatPartners: (chatPartners: ChatPartner[]) => void;
  setSelectedChat: (chatPartner: ChatPartner) => void;
  fetchChatHistory: (partner: ChatPartner) => void;
  loadChatPartners: (selectFirstPartner: boolean) => void;
  loading: (loading: boolean) => void;
}

const CreateGroupChatForm: React.FC<CreateGroupChatFormProps> = ({ userId, setChatType, setNewChat, chatPartners, setChatPartners, setSelectedChat, fetchChatHistory, loadChatPartners, loading }) => {

  const handleCreateGroup = async (values: { groupName: string }) => {
    loading(true);

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
      loading(false);
    }
  };

  const validationSchema = Yup.object({
    groupName: Yup.string()
      .required('Nazwa grupy nie może być pusta')
      .test('no-only-spaces', 'Nazwa grupy nie może zawierać tylko spacji', value => value ? value.trim().length > 0 : false)
  });

  return (
    <Formik
      initialValues={{ groupName: '' }}
      validationSchema={validationSchema}
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
