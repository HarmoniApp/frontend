import * as Yup from 'yup';

const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
};

export const addRoleValidationSchema = Yup.object({
    newRoleName: Yup.string()
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9 ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    newRoleColor: Yup.string().required('Kolor wymagany'),
});

export const editRoleValidationSchema = Yup.object({
    editedRoleName: Yup.string()
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9 ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    editedRoleColor: Yup.string().required('Kolor wymagany'),
});
