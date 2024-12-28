import { useState } from "react";
import { User } from "@/components/types/user";
import { Shift } from "@/components/types/shift";

export const useShiftModals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const handleAddShiftClick = (user: User, day: string) => {
    setSelectedUser(user);
    setSelectedDay(day);
    setIsAddModalOpen(true);
  };

  const handleEditShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsEditModalOpen(true);
  };

  return {
    isAddModalOpen,
    isEditModalOpen,
    selectedUser,
    selectedShift,
    selectedDay,
    handleAddShiftClick,
    handleEditShiftClick,
    setIsAddModalOpen,
    setIsEditModalOpen,
  };
};