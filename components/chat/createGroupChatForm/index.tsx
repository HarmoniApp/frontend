import React from 'react';
import ChatPartner from '@/components/types/chatPartner';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styles from './main.module.scss';

interface CreateGroupChatFormProps {
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
}

const CreateGroupChatForm: React.FC<CreateGroupChatFormProps> = ({ userId, setChatType, setNewChat, chatPartners, setChatPartners, setSelectedChat, fetchChatHistory, loadChatPartnersGroups, loading, setError }) => {

  const handleCreateGroup = async (values: { groupName: string }) => {
    loading(true);

    const groupData = {
      name: values.groupName,
      membersIds: [userId],
    };

    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });

      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
          body: JSON.stringify(groupData),
        });

        if (response.ok) {
          const newGroup = await response.json();
          setChatType('group');
          loadChatPartnersGroups(false);
          setNewChat(false);
          setChatPartners([...chatPartners, newGroup]);
          setSelectedChat(newGroup);
          fetchChatHistory(newGroup);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Błąd podczas tworzenia grupy');
        }
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia grupy:', error);
      setError('Błąd podczas tworzenia grupy');
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
