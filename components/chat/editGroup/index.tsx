import React, { useState, useEffect } from 'react';
import ChatPartner from '@/components/types/chatPartner';
import AuthorizedImage from '@/components/chat/authorizedImage';
import SearchUser from '@/components/chat/searchUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserMinus, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import { fetchCsrfToken } from '@/services/csrfService';

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
            const tokenXSRF = await fetchCsrfToken(setError);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}/user/${userId}/remove`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
            });

            if (response.ok) {
                setSelectedUsers(selectedUsers.filter((user: ChatPartner) => user.id !== userId));
            } else {
                console.error('Błąd podczas usuwania użytkownika z grupy');
            }
        } catch (error) {
            console.error('Błąd podczas usuwania członka grupy:', error);
            setError('Błąd podczas usuwania członka grupy');
        } finally {
            loading(false);
        }
    };

    const handleDeleteGroup = async (): Promise<void> => {
        if (!selectedChat || selectedChat.type !== 'group') {
            console.error("Error: No group selected or trying to delete a non-group chat.");
            setError("No group selected or trying to delete a non-group chat.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the group "${selectedChat.name}"? This can't be undone!`)) {
            return;
        }

        loading(true);

        try {
            const tokenXSRF = await fetchCsrfToken(setError);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete group "${selectedChat.name}"`);
            }

            console.log("Deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting group:", error);
            setError('Error deleting group');
        } finally {
            loading(false);
        }
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
            const tokenXSRF = await fetchCsrfToken(setError);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}/user/${user.id}/add`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                    'X-XSRF-TOKEN': tokenXSRF,
                },
                credentials: 'include',
            });

            if (response.ok) {
                setSelectedUsers([...selectedUsers, user]);
            } else {
                console.error('Błąd podczas dodawania użytkownika do grupy');
            }
        } catch (error) {
            console.error('Error while adding user to group:', error);
            setError('Error while adding user to group');
        } finally {
            loading(false);
        }
    };

    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <h3>Edit group</h3>
                    <SearchUser handleSelectUser={handleAddUserToGroup} groupChat={true} setError={setError} />
                    <div className={styles.selectedUsers}>
                        {selectedUsers.map((user) => (
                            <div key={user.id} className={styles.selectedUser}>
                                {user.photo ? (
                                    <AuthorizedImage
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                                        setError={setError}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                                )}
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
        </>
    );
};

export default EditGroup;
