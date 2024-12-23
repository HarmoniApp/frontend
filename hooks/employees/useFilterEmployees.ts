import Language from "@/components/types/language";
import Role from "@/components/types/role";
import { fetchLanguages } from "@/services/languageService";
import { fetchRoles } from "@/services/roleService";
import { useEffect, useRef, useState } from "react";

export const useFilterEmployee = (onApplyFilters: (filters: { roles?: number[]; languages?: number[]; order?: string; query?: string }) => void) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
    const [order, setOrder] = useState<string | null>(null);
    const [isPositionOpen, setIsPositionOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const positionListRef = useRef<HTMLDivElement>(null);
    const sortListRef = useRef<HTMLDivElement>(null);
    const languageListRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            await fetchRoles(setRoles);
            await fetchLanguages(setLanguages);
        };
        loadData();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filters: { roles?: number[]; languages?: number[]; order?: string } = {};
            if (selectedRoles.length) filters.roles = selectedRoles;
            if (selectedLanguages.length) filters.languages = selectedLanguages;
            if (order) filters.order = order;
            onApplyFilters(filters);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [selectedRoles, selectedLanguages, order]);

    const handleRoleChange = (roleId: number) => {
        setSelectedRoles((prevSelectedRoles) => {
            if (prevSelectedRoles.includes(roleId)) {
                return prevSelectedRoles.filter((id) => id !== roleId);
            } else {
                return [...prevSelectedRoles, roleId];
            }
        });
    };

    const handleLanguageChange = (languageId: number) => {
        setSelectedLanguages((prevSelectedLanguages) => {
            if (prevSelectedLanguages.includes(languageId)) {
                return prevSelectedLanguages.filter((id) => id !== languageId);
            } else {
                return [...prevSelectedLanguages, languageId];
            }
        });
    };

    const handleClearFilters = () => {
        setSelectedRoles([]);
        setSelectedLanguages([]);
        setOrder(null);
        onApplyFilters({});
    };

    const toggleSection = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, ref: React.RefObject<HTMLDivElement>) => {
        setIsOpen(prevIsOpen => {
            const isOpen = !prevIsOpen;
            if (ref.current) {
                if (isOpen) {
                    ref.current.style.height = `${ref.current.scrollHeight}px`;
                } else {
                    ref.current.style.height = '0';
                }
            }
            return isOpen;
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filters: { roles?: number[]; languages?: number[]; order?: string; query?: string } = {};
            if (selectedRoles.length) filters.roles = selectedRoles;
            if (selectedLanguages.length) filters.languages = selectedLanguages;
            if (order) filters.order = order;
            if (searchQuery) filters.query = searchQuery;
            onApplyFilters(filters);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [selectedRoles, selectedLanguages, order, searchQuery]);

    return {
        roles,
        languages,
        selectedRoles,
        selectedLanguages,
        order,
        searchQuery,
        isPositionOpen,
        isSortOpen,
        isLanguageOpen,
        setIsPositionOpen,
        setIsSortOpen,
        setIsLanguageOpen,
        positionListRef,
        sortListRef,
        languageListRef,
        setOrder,
        setSearchQuery,
        handleRoleChange,
        handleLanguageChange,
        handleClearFilters,
        toggleSection,
    };
}