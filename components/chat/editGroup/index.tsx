import React, { useEffect } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import SearchUser from '@/components/chat/searchUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';
import UserImage from '@/components/userImage';
import { deleteGroup, patchAddUserToGroup, patchRemoveUserFromGroup } from '@/services/chatService';

interface EditGroupProps {
    editGroupModal: (open: boolean) => void;
    selectedUsers: ChatPartner[];
    setSelectedUsers: (selectedUsers: ChatPartner[]) => void;
    selectedChat: ChatPartner | null;
    loading: (loading: boolean) => void;
    setError: (errorMessage: string | null) => void;
}

const EditGroup: React.FC<EditGroupProps> = ({ editGroupModal, selectedUsers, setSelectedUsers, selectedChat, loading, setError }) => {

    useEffect(() => {
        handleEditGroup();
    }, []);

    const loadGroupMembers = async () => {
        loading(true);

        try {
            if (!selectedChat) {
                console.error("Error: No group to edit.");
                return;
            }
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}/members`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenJWT}`,
                }
            });
            const members = await response.json();
            const membersWithNames = members.map((user: any) => ({
                ...user,
                name: `${user.firstname} ${user.surname}`
            }));
            setSelectedUsers(membersWithNames);
        } catch (error) {
            console.error('Błąd podczas pobierania członków grupy:', error);
            setError('Błąd podczas pobierania członków grupy');
        } finally {
            loading(false);
        }
    };

    const handleEditGroup = () => {
        loading(true);
        loadGroupMembers();
        loading(false);
    };

    const handleRemoveUserFromGroup = async (userId: number): Promise<void> => {
        if (!window.confirm("Are you sure to remove this user?")) {
            return;
        }
        loading(true);

        try {
            if (!selectedChat) {
                console.error("Error: No group to edit.");
                return;
            }
            await patchRemoveUserFromGroup(selectedChat.id, userId)
                setSelectedUsers(selectedUsers.filter((user: ChatPartner) => user.id !== userId));
                if (userId === parseInt(sessionStorage.getItem('userId') || '0')) {
                    window.location.reload();
                }
        } catch (error) {
            console.error('Błąd podczas usuwania członka grupy:', error);
        } finally {
            loading(false);
        }
    };

    const handleDeleteGroup = async (): Promise<void> => {
        if (!selectedChat || selectedChat.type !== 'group') {
            console.error("Error: No group selected or trying to delete a non-group chat.");
            return;
        }

        if (!window.confirm(`Czy na pewno usunąć grupę "${selectedChat.name}"? Tej akcji nie da się cofnąć!`)) {
            return;
        }
        await deleteGroup(selectedChat.id, loading)
    };

    const handleAddUserToGroup = async (user: ChatPartner): Promise<void> => {
        if (selectedUsers.some((existingUser) => existingUser.id === user.id)) {
            alert("User is already in the group.");
            return;
        }
        loading(true);

        try {
            if (!selectedChat) {
                console.error("Error: No group to edit.");
                return;
            }
            await patchAddUserToGroup(selectedChat.id, user.id)
            setSelectedUsers([...selectedUsers, user]);
        } catch (error) {
            console.error('Error while adding user to group:', error);
        } finally {
            loading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.title}>Edit group</h3>
                    <SearchUser handleSelectUser={handleAddUserToGroup} groupChat={true} setError={setError} />
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
