interface DeleteConfirmationProps {
    onClose: () => void;
    onDelete: () => void;
    info: string;
}

const DeleteConfirmation:React.FC <DeleteConfirmationProps> = ({onClose, onDelete, info}) => {

    const handleDelete = () => {
        onDelete();
        onClose();
    }
    // console.log("Render DeleteConfirmation for:", info);
    return (
        <div className="delete-confirmation">
            <div className="delete-confirmation__content">
                <h2 className="delete-confirmation__title">Delete Confirmation</h2>
                <p className="delete-confirmation__text">Are you sure you want to delete: {info}?</p>
                <div className="delete-confirmation__buttons">
                    <button className="delete-confirmation__button" onClick={onClose}>Cancel</button>
                    <button className="delete-confirmation__button" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;