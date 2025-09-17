import React, { useState } from "react";

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        onDelete();
        setShowConfirm(false);
    };

    const handleClick = () => {
        setShowConfirm(true);
    };

    if (showConfirm) {
        return (
            <div className="flex items-center space-x-2">
                <span className="text-gray-400">ยืนยันการลบ?</span>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                    ใช่
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                    ไม่ใช่
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
        >
            ลบ
        </button>
    );
};

export default DeleteButton;