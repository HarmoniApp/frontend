import * as Yup from 'yup';

export const groupValidationSchema = Yup.object({
    groupName: Yup.string()
        .required('Nazwa grupy nie może być pusta')
        .test('no-only-spaces', 'Nazwa grupy nie może zawierać tylko spacji', value => value ? value.trim().length > 0 : false)
});