import * as Yup from 'yup';

export const messageValidationSchema = Yup.object({
    message: Yup.string()
        .required('Wiadomość nie może być pusta')
        .test('no-only-spaces', 'Wiadomość nie może zawierać tylko spacji', value => value ? value.trim().length > 0 : false)
});
