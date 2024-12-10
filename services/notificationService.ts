import Notification from "@/components/types/notification";


export const fetchNotifications = async (
    setNotifications: (notifications: Notification[]) => void,
    setUnreadCount: (number: number) => void,
    userId: number): Promise<void> => {

    try {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenJWT}`,
            }
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data: Notification[] = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(notification => !notification.read).length);
    } catch (error) {
        console.error('Error while fetching notifications:', error);
    }
};