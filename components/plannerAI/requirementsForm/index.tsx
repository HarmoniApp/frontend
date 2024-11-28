import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PredefinedShift from '@/components/types/predefinedShifts';
import RoleWithColour from '@/components/types/roleWithColour';
import { ProgressSpinner } from 'primereact/progressspinner';
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
    const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);

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

    const handleRevoke = async () => {
        setModalIsOpenLoadning(true);

        if (!window.confirm('Czy na pewno chcesz usunąć wszystkie ostatnio wygenerowane przez PlanerAi zmiany?')) {
            setModalIsOpenLoadning(false);
            return;
        }

        try {
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenJWT}`,
                },
                credentials: 'include',
            });

            if (resquestXsrfToken.ok) {
                const data = await resquestXsrfToken.json();
                const tokenXSRF = data.token;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aiSchedule/revoke`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error from server:', errorData.message);
                    alert(`Błąd: ${errorData.message}`);
                }
                setModalIsOpenLoadning(false);
                if (response.ok) {
                    alert('Usunięto pomyślnie.');
                }
            } else {
                console.error('Failed to fetch XSRF token, response not OK');
            }
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    }

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
        setModalIsOpenLoadning(true);

        const invalidForms = forms.filter((form) => !form.date || form.shifts.length === 0 || form.shifts.some((shift) => shift.roles.length === 0));
        if (invalidForms.length > 0) {
            console.error('Invalid forms detected:', invalidForms);
            alert('Upewnij się, że wszystkie formularze mają poprawną datę, zmiany i role.');
            setModalIsOpenLoadning(false);
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

        console.log('Payload to send:', JSON.stringify(payload, null, 2));

        if (payload.some((form) => !form.date || form.shifts.length === 0)) {
            console.error('Payload contains invalid data. Please check your inputs.');
            return;
        }

        try {
            const tokenJWT = sessionStorage.getItem('tokenJWT');
            const resquestXsrfToken = await fetch(`http://localhost:8080/api/v1/csrf`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenJWT}`,
                },
                credentials: 'include',
            });

            if (resquestXsrfToken.ok) {
                const data = await resquestXsrfToken.json();
                const tokenXSRF = data.token;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/aiSchedule/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        'X-XSRF-TOKEN': tokenXSRF,
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error from server:', errorData.message);
                    alert(`Błąd: ${errorData.message}`);
                }
                setModalIsOpenLoadning(false);
                if (response.ok) {
                    alert('Wygenerowano pomyślnie.');
                }
            } else {
                console.error('Failed to fetch XSRF token, response not OK');
            }
        } catch (error) {
            console.error('Failed to send data:', error);
        }
    };

    const validationSchema = Yup.object({
        date: Yup.date().required('Pole wymagane').min(new Date(), 'Data nie może być w przeszłości'),
    });

    return (
        <div>
            {forms.map((form) => (
                <Formik
                    key={form.id}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
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
                    validateOnBlur={false}
                    validateOnChange={false}
                    validateOnSubmit={true}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form className={styles.planerAiForm}>
                            <div>
                                <label>Data</label>
                                <Field
                                    name="date"
                                    type="date"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setFieldValue("date", e.target.value);
                                        const updatedForms = forms.map((f) =>
                                            f.id === form.id ? { ...f, date: e.target.value } : f
                                        );
                                        setForms(updatedForms);
                                        console.log("Updated forms state:", JSON.stringify(updatedForms, null, 2));
                                    }}
                                />
                                {errors.date && touched.date && (
                                    <div className={styles.errorMessage}>{errors.date}</div>
                                )}
                            </div>
                            <div>
                                <label>Predefiniowane Zmiany</label>
                                {shifts.map((shift) => {
                                    const isSelected = values.shifts.some((s) => s.shiftId === shift.id);
                                    return (
                                        <div key={shift.id}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {
                                                    const updatedShifts = isSelected
                                                        ? values.shifts.filter((s) => s.shiftId !== shift.id)
                                                        : [...values.shifts, { shiftId: shift.id, roles: [] }];
                                                    setFieldValue('shifts', updatedShifts);

                                                    const updatedForms = forms.map((f) =>
                                                        f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                    );
                                                    setForms(updatedForms);
                                                    console.log("Updated forms state:", JSON.stringify(updatedForms, null, 2));
                                                }}
                                            />
                                            <span>{shift.name} ({shift.start} - {shift.end})</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                {values.shifts.map((shift) => (
                                    <div key={shift.shiftId} className={styles.roleContainer}>
                                        <strong>Predefioniowana zmiana: {shifts.find(s => s.id === shift.shiftId)?.name || 'Nieznana zmiana'} </strong>
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
                                                                s.shiftId === shift.shiftId ? { ...s, roles: updatedRoles } : s
                                                            );

                                                            setFieldValue('shifts', updatedShifts);

                                                            const updatedForms = forms.map((f) =>
                                                                f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                            );
                                                            setForms(updatedForms);
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
                                                                const newQuantity = Math.max(parseInt(e.target.value, 10) || 1, 1);

                                                                const updatedRoles = shift.roles.map((r) =>
                                                                    r.roleId === role.id ? { ...r, quantity: newQuantity } : r
                                                                );

                                                                const updatedShifts = values.shifts.map((s) =>
                                                                    s.shiftId === shift.shiftId ? { ...s, roles: updatedRoles } : s
                                                                );

                                                                setFieldValue('shifts', updatedShifts);

                                                                const updatedForms = forms.map((f) =>
                                                                    f.id === form.id ? { ...f, shifts: updatedShifts } : f
                                                                );
                                                                setForms(updatedForms);
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
                            {modalIsOpenLoadning && (
                                <div className={styles.loadingModalOverlay}>
                                    <div className={styles.loadingModalContent}>
                                        <div className={styles.spinnerContainer}><ProgressSpinner /></div>
                                    </div>
                                </div>
                            )}
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
            <button type="button" onClick={handleRevoke}>
                Usuń wszytskie ostatnio wygenerowane przez PlanerAi zmiany
            </button>
        </div>
    );
};

export default RequirementsForm;
