import * as Yup from 'yup';

export const shiftValidationSchema = Yup.object({
    selectedRole: Yup.string().required('Pole wymagane'),
    selectedStartTime: Yup.string()
        .required('Pole wymagane')
        .test('not-equal', 'Brak chronologii', function (value) {
            const { selectedEndTime } = this.parent;
            return value !== selectedEndTime;
        }),
    selectedEndTime: Yup.string()
        .required('Pole wymagane')
        .test('not-equal', 'Brak chronologii', function (value) {
            const { selectedStartTime } = this.parent;
            return value !== selectedStartTime;
        })
});