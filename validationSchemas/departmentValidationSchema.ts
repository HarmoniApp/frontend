import * as Yup from "yup";

const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
};

export const departmentValidationSchema = Yup.object().shape({
    department_name: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(100, 'Max 100 znaków')
        .required("Pole wymagane")
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    city: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(50, 'Max 50 znaków')
        .required("Pole wymagane")
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    zip_code: Yup.string()
        .min(5, 'Min 5 znaków')
        .max(10, 'Max 10 znaków')
        .required("Pole wymagane")
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[0-9-]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    street: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(100, 'Max 100 znaków')
        .required("Pole wymagane")
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    building_number: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(10, 'Max 10 znaków')
        .required("Pole wymagane")
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    apartment: Yup.string()
        .notRequired(),
});