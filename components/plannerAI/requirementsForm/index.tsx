import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PredefinedShift from '@/components/types/predefinedShifts';
import RoleWithColour from '@/components/types/roleWithColour';
import * as Yup from 'yup';
import styles from './main.module.scss';

interface RequirementsForm {
    id: number;
    date: string;
    shifts: {
        shiftId: number;
        roles: {
            roleId: number;
            quantity: number;
        }[];
    }[];
}

const RequirementsForm: React.FC = () => {
    const [forms, setForms] = useState<RequirementsForm[]>([
        { id: Date.now(), date: '', shifts: [] },
    ]);
    const [shifts, setShifts] = useState<PredefinedShift[]>([]);
    const [roles, setRoles] = useState<RoleWithColour[]>([]);
    const [formCounter, setFormCounter] = useState(1);

    useEffect(() => {
        fetchPredefinedShifts();
        fetchRole();
    }, []);

    const fetchPredefinedShifts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predefine-shift`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                },
            });

            const data = await response.json();
            if (Array.isArray(data)) {
                setShifts(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching predefined shifts:', error);
        }
    };

    const fetchRole = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/role`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                },
            });

            const data = await response.json();
            if (Array.isArray(data)) {
                setRoles(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching predefined shifts:', error);
        }
    };

    const validationSchema = Yup.object({
        date: Yup.date().required('Pole wymagane').min(new Date(), 'Data nie może być w przeszłości'),
    });

    const handleAddForm = () => {
        setForms((prevForms) => [
            ...prevForms,
            { id: Date.now() + formCounter, date: '', shifts: [] },
        ]);
        setFormCounter((prevCounter) => prevCounter + 1);
    };

    const handleRemoveForm = (id: number) => {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    };

    const handleSubmit = async () => {
        console.log('Forms state before mapping:', JSON.stringify(forms, null, 2));
    
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
    
        console.log('Payload to send:', JSON.stringify(payload, null, 2));
    
        if (payload.some((form) => !form.date || form.shifts.length === 0)) {
            console.error('Payload contains invalid data. Please check your inputs.');
            return;
        }
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aiSchedule/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from server:', errorData.message);
            } else {
                console.log('Data submitted successfully!');
            }
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };
    
    return (
        <div>
            {forms.map((form) => (
                <Formik
                    key={form.id}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log('Form values before update:', JSON.stringify(values, null, 2));
                        const updatedForms = [...forms];
                        const formIndex = updatedForms.findIndex((f) => f.id === form.id);
                        if (formIndex !== -1) {
                            updatedForms[formIndex] = { ...updatedForms[formIndex], ...values };
                            setForms(updatedForms);
                            console.log('Updated forms state:', JSON.stringify(updatedForms, null, 2));
                        } else {
                            console.error('Form not found in forms array!');
                        }
                    }}
                    
                >
                    {({ values, setFieldValue }) => (
                        <Form className={styles.planerAiForm}>
                            <div>
                                <label>Data</label>
                                <Field name="date" type="date" />
                                <ErrorMessage name="date" component="div" className={styles.errorMessage} />
                            </div>
                            <div>
                                <label>Zmiany</label>
                                {shifts.map((shift) => {
                                    const isSelected = values.shifts.some((s) => s.shiftId === shift.id);
                                    return (
                                        <div key={shift.id}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    const updatedShifts = isSelected
                                                        ? values.shifts.filter((s) => s.shiftId !== shift.id)
                                                        : [...values.shifts, { shiftId: shift.id, roles: [] }];
                                                    setFieldValue('shifts', updatedShifts);
                                                    console.log('Updated shifts:', JSON.stringify(updatedShifts, null, 2));
                                                }}
                                            />
                                            <span>{shift.name} ({shift.start} - {shift.end})</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <label>Role</label>
                                {values.shifts.map((shift) => (
                                    <div key={shift.shiftId} className={styles.roleContainer}>
                                        <strong>Shift ID: {shift.shiftId}</strong>
                                        {roles.map((role) => {
                                            const roleInShift = shift.roles.find((r) => r.roleId === role.id);
                                            const isRoleSelected = !!roleInShift;

                                            return (
                                                <div key={role.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isRoleSelected}
                                                        onChange={(e) => {
                                                            const updatedRoles = isRoleSelected
                                                                ? shift.roles.filter((r) => r.roleId !== role.id)
                                                                : [...shift.roles, { roleId: role.id, quantity: 1 }];
                                                            const updatedShifts = values.shifts.map((s) =>
                                                                s.shiftId === shift.shiftId
                                                                    ? { ...s, roles: updatedRoles }
                                                                    : s
                                                            );
                                                            setFieldValue('shifts', updatedShifts);
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            color: `${role.color}`,
                                                            padding: '4px',
                                                            marginLeft: '8px',
                                                        }}
                                                    >
                                                        {role.name}
                                                    </span>
                                                    {isRoleSelected && (
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={roleInShift?.quantity || 1}
                                                            onChange={(e) => {
                                                                const newQuantity = parseInt(e.target.value, 10) || 1;
                                                                const updatedRoles = shift.roles.map((r) =>
                                                                    r.roleId === role.id ? { ...r, quantity: newQuantity } : r
                                                                );
                                                                const updatedShifts = values.shifts.map((s) =>
                                                                    s.shiftId === shift.shiftId
                                                                        ? { ...s, roles: updatedRoles }
                                                                        : s
                                                                );
                                                                setFieldValue('shifts', updatedShifts);
                                                            }}
                                                            style={{
                                                                width: '60px',
                                                                marginLeft: '12px',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => handleRemoveForm(form.id)}>
                                Usuń dzień
                            </button>
                        </Form>
                    )}
                </Formik>
            ))}
            <button type="button" onClick={handleAddForm}>
                Dodaj kolejny dzień
            </button>
            <button type="button" onClick={handleSubmit}>
                Generuj
            </button>
        </div>
    );
};

export default RequirementsForm;
