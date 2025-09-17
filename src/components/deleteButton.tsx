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

    return (
        <>
            <button
                onClick={handleClick}
                className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
            >
                ลบ
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-700 p-6 rounded-lg shadow-xl text-center space-y-4">
                        <p className="text-gray-200 text-lg">ยืนยันการลบรายการนี้ใช่หรือไม่?</p>
                        <div className="flex justify-center space-x-4">
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
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteButton;