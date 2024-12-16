import * as Yup from 'yup';

export const planerAiValidationSchema = Yup.object({
    date: Yup.date()
        .required('Musisz podać datę')
        .min(new Date(), 'Data nie może być w przeszłości'),
    shifts: Yup.array()
        .min(1, 'Musisz wybrać co najmniej jedną zmianę')
        .required('Pole wymagane'),
});
