

const AddButton = ({ editingIndex, isImageSelected }: { editingIndex: boolean; isImageSelected: boolean }) => {
    const isDisabled = !editingIndex && !isImageSelected;
    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={`
                px-6 py-3 rounded-lg font-bold text-white transition-colors duration-300
                ${isDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
        >
            {editingIndex ? 'บันทึกการแก้ไข' : 'Add'}
        </button>
    );
};

export default AddButton;