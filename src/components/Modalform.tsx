import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const memberSchema = z.object({
  prefix: z.string().nonempty('กรุณาเลือกคำนำหน้า'),
  firstName: z.string().nonempty('ชื่อห้ามว่าง'),
  lastName: z.string().nonempty('นามสกุลห้ามว่าง'),
  photo: z.string().url('URL รูปถ่ายไม่ถูกต้อง').nonempty('รูปถ่ายห้ามว่าง'),
  workHistory: z.string().nonempty('ประวัติการทำงานห้ามว่าง'),
  pastAchievements: z.string().nonempty('ผลงานที่ผ่านมาห้ามว่าง'),
  ministerPosition: z.string().optional(),
  ministry: z.string().optional(),
  politicalParty: z.string().nonempty('สังกัดพรรคการเมืองห้ามว่าง'),
});

type Member = z.infer<typeof memberSchema>;

interface ModalFormProps {
  onClose: () => void;
  onSubmit: (data: Member) => void;
  defaultValues?: Member | null;
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose, onSubmit, defaultValues }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Member>({
    resolver: zodResolver(memberSchema),
    defaultValues: defaultValues || undefined,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({} as Member);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: Member) => {
    onSubmit(data);
    onClose();
    reset();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-8 w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 transform transition-all duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {defaultValues ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มข้อมูลสมาชิกใหม่'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">คำนำหน้า</label>
              <select {...register('prefix')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="">เลือก</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
              {errors.prefix && <p className="text-red-500 text-xs mt-1">{errors.prefix.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
              <input {...register('firstName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">นามสกุล</label>
              <input {...register('lastName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">รูปถ่าย (URL)</label>
              <input {...register('photo')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
              <input {...register('ministerPosition')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">กระทรวง</label>
              <input {...register('ministry')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">สังกัดพรรคการเมือง</label>
              <input {...register('politicalParty')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              {errors.politicalParty && <p className="text-red-500 text-xs mt-1">{errors.politicalParty.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ประวัติการทำงาน</label>
              <textarea {...register('workHistory')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md resize-y" rows={3} />
              {errors.workHistory && <p className="text-red-500 text-xs mt-1">{errors.workHistory.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ผลงานที่ผ่านมา</label>
              <textarea {...register('pastAchievements')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md resize-y" rows={3} />
              {errors.pastAchievements && <p className="text-red-500 text-xs mt-1">{errors.pastAchievements.message}</p>}
            </div>
            
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {defaultValues ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;