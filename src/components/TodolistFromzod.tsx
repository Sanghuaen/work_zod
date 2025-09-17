// Todolist.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteButton from './deleteButton';
import AddButton from './addButton';

const TaskSchema = z.object({
    title: z.string().trim().min(1, "กรุณากรอกชื่อ นามสกุล"),
    Member_id: z.string().trim().regex(/^\d{3}$/, "เลขประจำตัวสมาชิกต้องเป็นตัวเลข 3 หลัก"),
    group: z.string().optional().or(z.literal("")).refine(value => !value || value.trim().length > 0, {
        message: "ห้ามมีช่องว่างในพรรค",
    }),
    image: z.instanceof(FileList).optional().nullable().refine(fileList => {
        // เงื่อนไขนี้จะใช้เมื่อเพิ่มรายการใหม่เท่านั้น
        return !fileList || fileList.length > 0;
    }, {
        message: "กรุณาใส่รูปภาพ",
    }),
});

type Task = z.infer<typeof TaskSchema> & { image?: File | null };

export default function TodoApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
        watch
    } = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        defaultValues: { title: "", Member_id: "", group: "", image: undefined },
        mode: "onSubmit",
    });

    const onAdd = (data: z.infer<typeof TaskSchema>) => {
        // ตรวจสอบความซ้ำซ้อนของ Member_id
        if (tasks.some(task => task.Member_id === data.Member_id)) {
            setError("Member_id", {
                type: "manual",
                message: "เลขประจำตัวสมาชิกนี้มีอยู่แล้ว",
            });
            return;
        }

        // ตรวจสอบความซ้ำซ้อนของ title
        if (tasks.some(task => task.title === data.title)) {
            setError("title", {
                type: "manual",
                message: "ชื่อ นามสกุลนี้มีอยู่แล้ว",
            });
            return;
        }

        const newTask: Task = {
            title: data.title,
            Member_id: data.Member_id,
            group: data.group,
            image: data.image && data.image[0] ? data.image[0] : null,
        };
        setTasks((prev) => [...prev, newTask]);
        reset({ title: "", Member_id: "", group: "", image: undefined });
    };

    const onUpdate = (data: z.infer<typeof TaskSchema>) => {
        if (editingIndex !== null) {
            // ตรวจสอบความซ้ำซ้อนในโหมดแก้ไข (ยกเว้นรายการที่กำลังแก้ไขอยู่)
            if (tasks.some((task, index) => index !== editingIndex && task.Member_id === data.Member_id)) {
                setError("Member_id", {
                    type: "manual",
                    message: "เลขประจำตัวสมาชิกนี้มีอยู่แล้ว",
                });
                return;
            }

            if (tasks.some((task, index) => index !== editingIndex && task.title === data.title)) {
                setError("title", {
                    type: "manual",
                    message: "ชื่อ นามสกุลนี้มีอยู่แล้ว",
                });
                return;
            }

            const updatedTask: Task = {
                title: data.title,
                Member_id: data.Member_id,
                group: data.group,
                image: data.image && data.image[0] ? data.image[0] : tasks[editingIndex].image,
            };

            const newTasks = [...tasks];
            newTasks[editingIndex] = updatedTask;
            setTasks(newTasks);

            reset({ title: "", Member_id: "", group: "", image: undefined });
            setEditingIndex(null);
        }
    };

    const onDelete = (indexToDelete: number) => {
        setTasks((prev) => prev.filter((_, index) => index !== indexToDelete));
    };

    const onEdit = (indexToEdit: number) => {
        const taskToEdit = tasks[indexToEdit];
        reset({
            title: taskToEdit.title,
            Member_id: taskToEdit.Member_id,
            group: taskToEdit.group,
            image: null,
        });
        setEditingIndex(indexToEdit);
    };

    const watchedImage = watch("image");
    const isImageFileSelected = watchedImage && watchedImage.length > 0;

    return (
        <div className="bg-gray-800 text-gray-200 min-h-screen p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8">ทำเนียบรายชื่อสมาชิกผู้แทนราษฎร</h1>

            {/* Form Section */}
            <form
                onSubmit={handleSubmit(editingIndex !== null ? onUpdate : onAdd)}
                noValidate
                className="bg-gray-700 p-8 rounded-lg shadow-xl w-full max-w-xl flex flex-col space-y-4"
            >
                <div className="space-y-2">
                    <input
                        className="w-full px-4 py-2 rounded-md bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        placeholder="เลขประจำตัวสมาชิก"
                        {...register("Member_id")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                document.getElementById('title-input')?.focus();
                            }
                        }}
                    />
                    {errors.Member_id && <div className="text-red-400 text-sm">{errors.Member_id.message}</div>}
                </div>

                <div className="space-y-2">
                    <input
                        id="title-input"
                        className="w-full px-4 py-2 rounded-md bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        placeholder="ชื่อ นามสกุล"
                        {...register("title")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                document.getElementById('group-input')?.focus();
                            }
                        }}
                    />
                    {errors.title && <div className="text-red-400 text-sm">{errors.title.message}</div>}
                </div>

                <div className="space-y-2">
                    <input
                        id="group-input"
                        className="w-full px-4 py-2 rounded-md bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        placeholder="พรรค"
                        {...register("group")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                document.getElementById('image-input')?.focus();
                            }
                        }}
                    />
                    {errors.group && <div className="text-red-400 text-sm">{errors.group.message}</div>}
                </div>

                <div className="space-y-2">
                    <label className="text-gray-300">รูปภาพ:</label>
                    <input
                        id="image-input"
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit(editingIndex !== null ? onUpdate : onAdd)();
                            }
                        }}
                    />
                    {errors.image && <div className="text-red-400 text-sm">{errors.image.message as string}</div>}
                </div>

                <AddButton editingIndex={editingIndex !== null} isImageSelected={isImageFileSelected} />
            </form>

            {/* Task List Section */}
            <ul className="mt-8 w-full max-w-xl space-y-4">
                {tasks.map((task, index) => (
                    <li
                        key={index}
                        className="bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6"
                    >
                        {task.image && (
                            <div className="flex-shrink-0">
                                <img
                                    src={URL.createObjectURL(task.image)}
                                    alt="รูปภาพสมาชิก"
                                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-500"
                                />
                            </div>
                        )}
                        <div className="flex-grow text-center md:text-left">
                            <div className="text-lg font-semibold">
                                <span className="text-gray-400">เลขประจำตัว:</span> {task.Member_id}
                            </div>
                            <div className="text-lg font-semibold">
                                <span className="text-gray-400">ชื่อ นามสกุล:</span> {task.title}
                            </div>
                            {task.group && (
                                <div className="text-sm text-gray-400">
                                    พรรค: {task.group}
                                </div>
                            )}
                        </div>
                        <div className="flex-shrink-0 flex space-x-2">
                            <button
                                onClick={() => onEdit(index)}
                                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
                            >
                                แก้ไข
                            </button>
                            <DeleteButton onDelete={() => onDelete(index)} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}