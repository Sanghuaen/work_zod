import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './App.css'

// กำหนด Schema และ Type ของข้อมูลสมาชิก
export const memberSchema = z.object({
  id: z.string().nonempty('รหัสประจำตัวห้ามว่าง'),
  prefix: z.string().nonempty('คำนำหน้าห้ามว่าง'),
  firstName: z.string().nonempty('ชื่อห้ามว่าง'),
  lastName: z.string().nonempty('นามสกุลห้ามว่าง'),
  photo: z.string().url('URL รูปถ่ายไม่ถูกต้อง').nonempty('รูปถ่ายห้ามว่าง'),
  workHistory: z.string().nonempty('ประวัติการทำงานห้ามว่าง'),
  pastAchievements: z.string().nonempty('ผลงานที่ผ่านมาห้ามว่าง'),
  ministerPosition: z.string().optional(),
  ministry: z.string().optional(),
  politicalParty: z.string().nonempty('สังกัดพรรคการเมืองห้ามว่าง'),
});

export type Member = z.infer<typeof memberSchema>;

// ข้อมูลสมาชิกเบื้องต้น
const initialMembers: Member[] = [
  {
    id: '001',
    prefix: 'นางสาว',
    firstName: 'กมนทรรศน์',
    lastName: 'กิตติสุนทรสกุล',
    photo: 'https://prod-mfp-imgsrv.tillitsdone.com/uploads/medium_2_1_0c9898e3eb.jpg',
    workHistory : 'ตัวแทนประกันชีวิต บริษัท FWD (Thailand) จำกัด มหาชน, ตัวแทนประกันวินาศภัย บริษัท FWD-GI (Thailand) จำกัด มหาชน, ผู้แนะนำการลงทุนตราสารทั่วไป, หุ้นส่วนผู้จัดการ ห้างหุ้นส่วนจำกัด ไฟร์-ดีเฟนซ์ ซัพพลาย แอนด์ เซอร์วิสส',
    pastAchievements: 'ผลงาน',
    ministerPosition: 'สมาชิกสภาผู้แทนราษฎรจังหวัดระยอง เขตเลือกตั้งที่ 1',
    politicalParty: 'พรรคประชาชน',
  },
  {
    id: '002',
    prefix: 'นาย',
    firstName: 'กมลศักดิ์',
    lastName: 'ลีวาเมาะ',
    photo: 'https://www.dailynews.co.th/wp-content/uploads/2024/11/S__233332799.jpg',
    workHistory: 'เลขานุการคณะกรรมาธิการ กมธ. การกฎหมาย การยุติธรรมและสิทธิมนุษยชน สภาผู้แทนฯ , กรรมาธิการ กมธ.วิสามัญ พิจารณาศึกษาแนวทางในการบริหารจัดการการชำระหนี้กองทุนเงินให้กู้ยืมเพื่อการศึกษา สภาผู้แทนฯ',
    pastAchievements: 'ผลงาน',
    ministerPosition: 'สมาชิกสภาผู้แทนราษฎรจังหวัดนราธิวาส เขตเลือกตั้งที่ 5',
    politicalParty: 'พรรคประชาชาติ',
  },
  {
    id: '003',
    prefix: 'นาย',
    firstName: 'กรวีร์ ',
    lastName: ' ปริศนานันทกุล',
    photo: 'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6rMeFNw1sqlar6p62nDv63oo8kLuYFIHGec3fT4ndVPVvT47U1o.webp',
    workHistory: 'กรวีร์ เคยทำงานการเมืองท้องถิ่นในตำแหน่งเลขานุการนายกองค์การบริหารส่วนจังหวัดอ่างทอง ในระหว่างปี พ.ศ. 2552 ถึงปี พ.ศ. 2554 ต่อมาจึงได้ลงสมัครรับเลือกตั้งเป็นสมาชิกสภาผู้แทนราษฎรจังหวัดอ่างทอง ในการเลือกตั้งสมาชิกสภาผู้แทนราษฎรไทยเป็นการทั่วไป พ.ศ. 2554 สังกัดพรรคชาติไทยพัฒนา และได้รับเลือกตั้งเป็นสมัยแรกปี พ.ศ. 2561 เขาได้ย้ายไปสังกัดพรรคภูมิใจไทย และได้รับเลือกตั้งเป็นสมาชิกสภาผู้แทนราษฎรแบบบัญชีรายชื่อ ในการเลือกตั้ง พ.ศ. 2562',
    pastAchievements: 'ผลงาน',
    ministerPosition: 'สมาชิกสภาผู้แทนราษฎรจังหวัดอ่างทอง เขตเลือกตั้งที่ 2',
    politicalParty: 'พรรคภูมิใจไทย',
  },
];

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Member>({
    resolver: zodResolver(memberSchema),
  });

  // ใช้ useEffect เพื่อรีเซ็ตค่าในฟอร์มเมื่อมีการเปลี่ยนแปลง editingMember
  useEffect(() => {
    if (editingMember) {
      reset(editingMember);
    } else {
      reset({});
    }
  }, [editingMember, reset]);

  const onSubmit = (data: Member) => {
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? data : m));
    } else {
      setMembers([...members, { ...data, id: (Math.random() * 10000000).toFixed(0) }]);
    }
    setEditingMember(null);
    setShowForm(false);
  };

  const handleDeleteMember = (memberToDelete: Member) => {
    setMembers(members.filter(m => m.id !== memberToDelete.id));
  };
  
  const handleOpenForm = (memberToEdit?: Member) => {
    setEditingMember(memberToEdit || null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto p-4 font-sans">
        <h1 className="text-3xl font-bold text-center mb-6">ทำเนียบรายชื่อสมาชิกสภาผู้แทนราษฎร</h1>
        
        <div className="flex justify-center mb-4">
          <button 
            onClick={() => handleOpenForm()} 
            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            เพิ่มสมาชิกใหม่
          </button>
        </div>

        {/* ส่วนของ Modal และ Form ที่ถูกปรับปรุงการออกแบบแล้ว */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full h-full flex justify-center items-center z-50">
            <div className="relative p-8 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              {/* ปุ่มปิดฟอร์มใช้ SVG icon */}
              <button 
                onClick={handleCloseForm} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
                {editingMember ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มข้อมูลสมาชิกใหม่'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">รหัสประจำตัว</label>
                    <input {...register('id')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" disabled={editingMember !== null} />
                    {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">คำนำหน้า</label>
                    <select {...register('prefix')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white">
                      <option value="">เลือก</option>
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="นางสาว">นางสาว</option>
                    </select>
                    {errors.prefix && <p className="text-red-500 text-xs mt-1">{errors.prefix.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อ</label>
                    <input {...register('firstName')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">นามสกุล</label>
                    <input {...register('lastName')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">รูปถ่าย (URL)</label>
                    <input {...register('photo')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" />
                    {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ตำแหน่ง</label>
                    <input {...register('ministerPosition')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">กระทรวง</label>
                    <input {...register('ministry')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">สังกัดพรรคการเมือง</label>
                    <input {...register('politicalParty')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white" />
                    {errors.politicalParty && <p className="text-red-500 text-xs mt-1">{errors.politicalParty.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ประวัติการทำงาน</label>
                    <textarea {...register('workHistory')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-y bg-white dark:bg-gray-700 text-black dark:text-white" rows={3} />
                    {errors.workHistory && <p className="text-red-500 text-xs mt-1">{errors.workHistory.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ผลงานที่ผ่านมา</label>
                    <textarea {...register('pastAchievements')} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-y bg-white dark:bg-gray-700 text-black dark:text-white" rows={3} />
                    {errors.pastAchievements && <p className="text-red-500 text-xs mt-1">{errors.pastAchievements.message}</p>}
                  </div>
                  
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    {editingMember ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ตารางแสดงรายชื่อสมาชิก */}
        <div className="p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">รายชื่อสมาชิกทั้งหมด</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <img src={member.photo} alt={`${member.firstName} ${member.lastName}`} className="h-24 w-24 rounded-full object-cover mb-4" />
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">รหัส: {member.id}</p>
                  <h3 className="text-xl font-semibold mb-1">{member.prefix} {member.firstName} {member.lastName}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{member.politicalParty}</p>
                  
                  <div className="w-full text-left mt-2">
                    {member.ministerPosition && (
                      <div className="mb-2">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">ตำแหน่ง:</p>
                        <p className="text-sm">{member.ministerPosition}</p>
                      </div>
                    )}
                    <div className="mb-2">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">ประวัติการทำงาน:</p>
                      <p className="text-sm whitespace-pre-wrap">{member.workHistory}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">ผลงานที่ผ่านมา:</p>
                      <p className="text-sm whitespace-pre-wrap">{member.pastAchievements}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button onClick={() => handleOpenForm(member)} className="py-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm">แก้ไข</button>
                    <button onClick={() => handleDeleteMember(member)} className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm">ลบ</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                ไม่พบข้อมูลสมาชิก
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
