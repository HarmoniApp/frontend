import ConfirmationPopUp from "@/components/confirmationPopUp";
import { wrapText } from "@/utils/wrapText";
import { contractValidationSchema } from "@/validationSchemas/contractValidationSchema";
import { faCheck, faXmark, faPen, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Tooltip } from "primereact/tooltip";
import styles from './main.module.scss';
import classNames from 'classnames';
import Contract from "@/components/types/contract";

interface EditContractTypeFormProps {
    contract: Contract;
    editingContractId: number | null;
    setEditingContractId: (id: number | null) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
    deleteContractId: number | null;
    handleEditContractType: (values: any, { resetForm }: any) => void;
    handleDeleteContractType: (id: number) => void;
    openDeleteModal: (id: number) => void;
}

export const EditContractTypeForm: React.FC<EditContractTypeFormProps> = ({
    contract,
    editingContractId,
    setEditingContractId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteContractId,
    handleEditContractType,
    handleDeleteContractType,
    openDeleteModal
}) => {
    const isTruncated = wrapText(contract.name, 15) !== contract.name;
    const elementId = `contractName-${contract.id}`;

    return (
        <Formik
            key={contract.id}
            initialValues={{ id: contract.id, name: contract.name, absence_days: contract.absence_days }}
            validationSchema={contractValidationSchema}
            enableReinitialize={true}
            onSubmit={handleEditContractType}
        >
            {({ handleSubmit, handleChange, values, errors, touched, resetForm }) => (
                <Form onSubmit={handleSubmit}>
                    <div className={styles.showContractContainerMain}>
                        <ErrorMessage name="name" component="div" className={styles.errorMessage} />
                        <ErrorMessage name="absence_days" component="div" className={styles.errorMessage} />
                        <div className={styles.showContractContainer}>
                            <div className={styles.contractInfoContainer}>
                                {editingContractId === contract.id ? (
                                    <>
                                        <Field
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            className={classNames(styles.formInput, {
                                                [styles.errorInput]: errors.name && touched.name,
                                            })}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p
                                            className={styles.contractNameParagraph}
                                            data-pr-tooltip={contract.name}
                                            data-pr-position="right"
                                            id={elementId}
                                            style={{
                                                cursor: isTruncated ? 'pointer' : 'default',
                                            }}
                                        >
                                            {wrapText(contract.name, 15)}
                                        </p>
                                        {isTruncated && (
                                            <Tooltip target={`#${elementId}`} autoHide />
                                        )}
                                        <p className={styles.contractDaysParagraph}>{contract.absence_days} dni</p>
                                    </>
                                )}
                            </div>
                            <div className={styles.editAndRemoveButtonContainer}>
                                {editingContractId === contract.id ? (
                                    <>
                                        <Field
                                            component="input"
                                            type="number"
                                            name="absence_days"
                                            value={values.absence_days}
                                            onChange={handleChange}
                                            className={classNames(styles.absenceDaysInput, {
                                                [styles.errorInput]: errors.absence_days && touched.absence_days,
                                            })}
                                        />
                                        <button className={styles.yesButton} type="submit">
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.noButton}
                                            onClick={() => {
                                                resetForm();
                                                setEditingContractId(null);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type='button' className={styles.editButton} onClick={() => setEditingContractId(contract.id)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button type='button' className={styles.removeButton} onClick={() => openDeleteModal(contract.id)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {isDeleteModalOpen && deleteContractId === contract.id && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContent}>
                                <ConfirmationPopUp
                                    action={() => handleDeleteContractType(contract.id)}
                                    onClose={() => setIsDeleteModalOpen(false)}
                                    description={`Usunąć typ umowy o nazwie: ${contract.name}`}
                                />
                            </div>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
};