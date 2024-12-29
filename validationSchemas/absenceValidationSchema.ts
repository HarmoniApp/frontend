import * as Yup from 'yup';

export const absenceValidationSchema = Yup.object({
    absence_type_id: Yup.string().required('Pole wymagane'),
    start: Yup.date()
        .required('Pole wymagane')
        .min(new Date(), 'Data nie może być w przeszłości'),
    end: Yup.date()
        .required('Pole wymagane')
        .min(Yup.ref('start'), 'Data zakończenia nie może być przed datą rozpoczęcia'),
});