import * as Yup from 'yup';
import { toast } from 'react-toastify';

export const importEmployeesValidationSchema = Yup.object({
    file: Yup.mixed()
        .required(() => {
            return toast.warning('Plik jest wymagany!');
        })
        .test('fileSize', (value) => {
            if (value instanceof File && value.size > 2 * 1024 * 1024) {
                toast.warning('Plik za duży, maksymalny rozmiar to 2MB!');
                return false;
            }
            return true;
        })
        .test('fileFormat', (value) => {
            if (value instanceof File && !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(value.type)) {
                toast.warning('Niedozwolony format pliku. Dozwolone formaty to: .xlsx!');
                return false;
            }
            return true;
        }),
});