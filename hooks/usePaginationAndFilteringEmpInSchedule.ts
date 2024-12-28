import { useState, useEffect } from "react";
import { User } from "@/components/types/user";
import { fetchFilterUsersInSchedule } from "@/services/scheduleService";

export const usePaginationAndFilteringEmpInSchedule = ({ searchQuery }: { searchQuery: string }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            setLoadingUsers(true);
            try {
                await fetchFilterUsersInSchedule({ query: searchQuery }, setUsers, setTotalPages, pageNumber, pageSize);
            } catch (error) {
                console.error("Error fetching filtered users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };
        loadData();
    }, [searchQuery, pageNumber, pageSize]);

    return {
        users,
        loadingUsers,
        pageNumber,
        pageSize,
        totalPages,
        setPageNumber,
        setPageSize,
    };
};