import * as Yup from 'yup';

export const planerAiValidationSchema = Yup.object({
    date: Yup.date()
        .required('Musisz podać datę')
        .min(new Date(), 'Data nie może być w przeszłości'),
        shifts: Yup.array()
        .of(
            Yup.object().shape({
                shiftId: Yup.number().required('ID zmiany jest wymagane'),
                roles: Yup.array()
                    .of(
                        Yup.object().shape({
                            roleId: Yup.number().required('ID roli jest wymagane'),
                            quantity: Yup.number()
                                .required('Ilość jest wymagana')
                                .min(1, 'Ilość musi być większa niż 0'),
                        })
                    )
                    .min(1, 'Każda zmiana musi mieć co najmniej jedną rolę'),
            })
        )
        .min(1, 'Musisz dodać przynajmniej jedną zmianę'),
});
