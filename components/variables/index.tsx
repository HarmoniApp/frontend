import { getUserId, isUserAdmin } from  '@/components/login'

export const loggedUserID = getUserId;
export const loggedUserRoleAdmin = isUserAdmin;