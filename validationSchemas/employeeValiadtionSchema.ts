import * as Yup from 'yup';

const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
};

const polishRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ -]*$/;

export const employeeValidationSchema = Yup.object({
    employee_id: Yup.string()
        .min(1, 'Min 1 znaków')
        .max(20, 'Max 20 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9-]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
    firstname: Yup.string()
        .min(2, 'Min 2 znaków')
        .max(50, 'Max 50 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', polishRegex);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
    surname: Yup.string()
        .min(2, 'Min 2 znaków')
        .max(50, 'Max 50 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', polishRegex);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
    email: Yup.string()
        .email('Niepoprawny email')
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
    phone_number: Yup.string()
        .min(9, 'Min 9 znaków')
        .max(15, 'Max 15 znaków')
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[0-9 +]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
    residence: Yup.object().shape({
        city: Yup.string()
            .min(1, 'Min 1 znaków')
            .max(50, 'Max 50 znaków')
            .required('Pole wymagane')
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
            }),
        street: Yup.string()
            .min(1, 'Min 1 znaków')
            .max(100, 'Max 100 znaków')
            .required('Pole wymagane')
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z ]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
            }),
        building_number: Yup.string()
            .min(1, 'Min 1 znaków')
            .max(10, 'Max 10 znaków')
            .required('Pole wymagane')
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
            }),
        apartment: Yup.string()
            .min(1, 'Min 1 znaków')
            .max(10, 'Max 10 znaków')
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
            }),
        zip_code: Yup.string()
            .min(5, 'Min 5 znaków')
            .max(10, 'Max 10 znaków')
            .required('Pole wymagane')
            .test('no-invalid-chars', function (value) {
                const invalidChars = findInvalidCharacters(value || '', /^[0-9-]*$/);
                return invalidChars.length === 0
                    ? true
                    : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
            }),
    }),
    contract_signature: Yup.date()
        .required('Pole wymagane')
        .test('is-before-expiration', 'Brak chronologii', function (value) {
            const { contract_expiration } = this.parent;
            return contract_expiration ? new Date(value) <= new Date(contract_expiration) : true;
        }),
    contract_expiration: Yup.date()
        .required('Pole wymagane')
        .test('is-after-signature', 'Brak chronologii', function (value) {
            const { contract_signature } = this.parent;
            return contract_signature ? new Date(value) >= new Date(contract_signature) : true;
        }),
    contract_type: Yup.object().shape({
        id: Yup.number().min(1, 'Pole wymagane').required('Pole wymagane'),
    }),
    supervisor_id: Yup.string()
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znak: ${invalidChars.join(', ')}` });
        }),
    work_address: Yup.object().shape({
        id: Yup.number().min(1, 'Pole wymagane').required('Pole wymagane'),
    }),
    roles: Yup.array().min(1, 'Przynajmniej jedna rola jest wymagana'),
    languages: Yup.array().min(1, 'Przynajmniej jeden język jest wymagany'),
});