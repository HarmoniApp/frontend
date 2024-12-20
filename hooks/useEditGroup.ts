import ChatPartner from "@/components/types/chatPartner";
import { fetchGroupMembers, patchRemoveUserFromGroup, deleteGroup, patchAddUserToGroup } from "@/services/chatService";
import { useEffect, useState } from "react";

const useEditGroup = (
    selectedChat: ChatPartner | null,
    setLoading: (loading: boolean) => void
) => {
    const [selectedUsers, setSelectedUsers] = useState<ChatPartner[]>([]);

    useEffect(() => {
        handleEditGroup();
    }, []);

    const handleEditGroup = async () => {
        setLoading(true);
        if (!selectedChat) {
            console.error("Error: No group to edit.");
            return;
        }
        await fetchGroupMembers(selectedChat.id, setSelectedUsers)
        setLoading(false);
    };

    const handleRemoveUserFromGroup = async (userId: number): Promise<void> => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
            return;
        }
        setLoading(true);

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
            console.error('Error while removing user from group:', error);
        } finally {
            setLoading(false);
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
        await deleteGroup(selectedChat.id)
    };

    const handleAddUserToGroup = async (user: ChatPartner): Promise<void> => {
        if (selectedUsers.some((existingUser) => existingUser.id === user.id)) {
            alert("User is already in the group.");
            return;
        }
        setLoading(true);

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
            setLoading(false);
        }
    };

    return {
        selectedUsers,
        handleAddUserToGroup,
        handleRemoveUserFromGroup,
        handleDeleteGroup,
    };
}

export default useEditGroup;