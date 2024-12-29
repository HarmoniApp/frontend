import * as Yup from 'yup';
import { toast } from 'react-toastify';

export const photoValidationSchema = Yup.object({
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
            if (value instanceof File && !['image/jpeg', 'image/png'].includes(value.type)) {
                toast.warning('Niedozwolony format pliku. Dozwolone formaty to: .jpeg, .png!');
                return false;
            }
            return true;
        }),
});