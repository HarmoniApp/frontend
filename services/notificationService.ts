import Notification from "@/components/types/notification";
import { fetchCsrfToken } from "./csrfService";

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

export const patchMarkNotificationAsRead = async (
    notificationId: number): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notification/${notificationId}/read`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
        if (!response.ok) {
            console.error("Failed to mark notification as read: ", response.statusText);
            throw new Error(`Failed to mark notification as read`);
        }
    } catch (error) {
        console.error(`Error while marking norification as read`, error);
    }
};