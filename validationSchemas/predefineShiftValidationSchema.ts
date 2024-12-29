import * as Yup from 'yup';

const findInvalidCharacters = (value: string, allowedPattern: RegExp): string[] => {
    const invalidChars = value.split('').filter(char => !allowedPattern.test(char));
    return Array.from(new Set(invalidChars));
};

export const predefineShiftValidationSchema = Yup.object({
    name: Yup.string()
        .required('Pole wymagane')
        .test('no-invalid-chars', function (value) {
            const invalidChars = findInvalidCharacters(value || '', /^[a-zA-Z0-9\s]*$/);
            return invalidChars.length === 0
                ? true
                : this.createError({ message: `Niedozwolone znaki: ${invalidChars.join(', ')}` });
        }),
    start: Yup.string()
        .required('Wybierz godzinę rozpoczęcia')
        .test('start-before-end', 'Brak chronologii', function (start, context) {
            const { end } = context.parent;
            return start !== end;
        }),
    end: Yup.string()
        .required('Wybierz godzinę zakończenia')
        .test('start-before-end', 'Brak chronologii', function (end, context) {
            const { start } = context.parent;
            return start !== end;
        }),
});