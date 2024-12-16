import * as Yup from 'yup';

const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
};

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Niepoprawny adres e-mail.')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9@.-]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        })
        .test('no-consecutive-special-chars', 'Niedozwolone znaki', function (value) {
            const invalidPattern = /(\.\.|--|@@)/;
            return !invalidPattern.test(value || '');
        }),
    password: Yup.string().required('Hasło jest wymagane'),
});

export const changePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required('Wymagane nowe hasło')
        .min(8, 'Hasło musi mieć co najmniej 8 znaków')
        .matches(/[0-9]/, 'Hasło wymaga cyfry')
        .matches(/[a-z]/, 'Hasło wymaga małej litery')
        .matches(/[A-Z]/, 'Hasło wymaga dużej litery')
        .matches(/[^\w]/, 'Hasło wymaga znaku specjalnego'),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Hasła muszą być takie same')
        .required('Potwierdzenie hasła jest wymagane'),
});