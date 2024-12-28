import React from 'react';
import { ChatPartner } from '@/components/types/chatPartner';
import SearchUser from '@/components/chat/searchUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faXmark, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import UserImage from '@/components/userImage';
import { useEditGroup } from '@/hooks/chat/useEditGroup';

interface EditGroupProps {
    editGroupModal: (open: boolean) => void;
    selectedChat: ChatPartner | null;
    setLoading: (loading: boolean) => void;
    setIsEditGroupModalOpen: (isOpen: boolean) => void;
}

const EditGroup: React.FC<EditGroupProps> = ({ editGroupModal, selectedChat, setLoading, setIsEditGroupModalOpen }) => {
    const {
        selectedUsers,
        handleAddUserToGroup,
        handleRemoveUserFromGroup,
        handleDeleteGroup,
    } = useEditGroup(selectedChat, setLoading);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <FontAwesomeIcon icon={faX} onClick={() => setIsEditGroupModalOpen(false)} className={styles.iconClose} />
                <h3 className={styles.title}>Edit group</h3>
                <SearchUser handleSelectUser={handleAddUserToGroup} groupChat={true} />
                <div className={styles.selectedUsers}>
                    {selectedUsers.map((user) => (
                        <div key={user.id} className={styles.selectedUser}>
                            <div className={styles.imageContainer}>
                                <UserImage userId={user.id} />
                            </div>
                            <p>{user.name}</p>
                            <FontAwesomeIcon icon={faUserMinus} onClick={() => handleRemoveUserFromGroup(user.id)} className={styles.removeIcon} />
                        </div>
                    ))}
                </div>
                <div className={styles.groupActions}>
                    <FontAwesomeIcon
                        icon={faTrash}
                        className={styles.deleteIcon}
                        onClick={handleDeleteGroup}
                    />
                </div>
                <FontAwesomeIcon icon={faXmark} onClick={() => editGroupModal(false)} className={styles.closeIcon} />
            </div>
        </div>
    );
};
export default EditGroup;