import * as Yup from 'yup';

const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
};

export const contractValidationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Min 2 znaków')
        .max(50, 'Max 50 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9\s]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    absence_days: Yup.number()
        .min(0, 'Liczba dni nie może być mniejsza niż 0')
        .required('Pole wymagane')
        .typeError('Wprowadź poprawną liczbę')
});