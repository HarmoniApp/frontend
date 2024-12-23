import PredefinedShift from "@/components/types/predefinedShifts";
import IRequirementsForm from "@/components/types/requirementsForm";
import Role from "@/components/types/role";
import { generateScheduleAi, revokeScheduleAi } from "@/services/planerAiService";
import { fetchPredefinedShifts } from "@/services/predefineShiftService";
import { fetchRoles } from "@/services/roleService";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";

export const useRequirementsFormManagement = () => {
    const [forms, setForms] = useState<IRequirementsForm[]>([
        { id: Date.now(), date: '', shifts: [] },
    ]);
    const [predefineShifts, setPredefineShifts] = useState<PredefinedShift[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const formRefs = useRef<FormikProps<any>[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchPredefinedShifts(setPredefineShifts);
            await fetchRoles(setRoles);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleAddForm = () => {
        setForms((prevForms) => [
            ...prevForms,
            { id: Date.now(), date: '', shifts: [] },
        ]);
    };

    const handleRemoveForm = (id: number) => {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
        formRefs.current = formRefs.current.filter((ref, index) => forms[index]?.id !== id);
    };

    const handleSubmit = async () => {
        const validationPromises = formRefs.current.map(async (formRef) => {
            await formRef.setTouched({
                date: true,
                shifts: true,
            });

            return formRef.validateForm();
        });

        const validationResults = await Promise.all(validationPromises);
        const hasErrors = validationResults.some((errors) => Object.keys(errors).length > 0);
        if (hasErrors) {
            console.error('Niektóre formularze zawierają błędy:', validationResults);
            return;
        }

        const payload = forms.map((form) => ({
            date: form.date,
            shifts: form.shifts.map((shift) => ({
                shiftId: shift.shiftId,
                roles: shift.roles.map((role) => ({
                    roleId: role.roleId,
                    quantity: role.quantity,
                })),
            })),
        }));

        try {
            await generateScheduleAi(payload);

            formRefs.current.forEach((formRef) => {
                formRef.resetForm();
            });
        } catch (error) {
            console.error('Wystąpił błąd przy wysyłaniu danych:', error);
        }
    };

    const handleRevoke = async () => {
        try {
            setIsConfirmationModalOpen(false);
            await revokeScheduleAi();
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

    const handleEditDate = (formId: number, value: string) => {
        setForms((prevForms) =>
            prevForms.map((form) =>
                form.id === formId ? { ...form, date: value } : form
            )
        );
    };

    return {
        forms,
        setForms,
        predefineShifts,
        roles,
        loading,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        formRefs,
        handleAddForm,
        handleRemoveForm,
        handleEditDate,
        handleSubmit,
        handleRevoke,
    };
}