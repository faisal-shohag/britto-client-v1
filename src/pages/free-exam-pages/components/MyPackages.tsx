import { usePackagesByUser } from '@/hooks/free-exam-hooks/use-packages';
import { bnNumber } from '@/lib/bnNumbers';
import { BsFillBackpackFill } from "react-icons/bs";
import { Spinner } from './Splash';
const MyPackages = ({userId}: {userId: number}) => {
    const { data: packages, isLoading } = usePackagesByUser(userId);
    
    if (isLoading) return <div>
       <Spinner/>
    </div>;
    
    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-xl'>
                <span><BsFillBackpackFill /></span>
                <h1>আমার এক্সাম প্যাকেজ</h1>
            </div>
         <div className='grid grid-cols-2 '>
               {packages?.map(pkg => (
                <div className=' border p-3 rounded-xl text-center bg-gradient-to-r from-indigo-500 
                via-purple-500 to-pink-600 text-white flex flex-col items-center gap-2' key={pkg.id}>
                    <h3 className='font-semibold'>{pkg.title}</h3>
                    <div className='text-xs bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-[100px]'>{pkg.group}</div>
                    <div className='flex items-center gap-2 text-sm'>
                        <span>পরীক্ষা: ১৪টি</span> |
                        <span>অংশগ্রহণ: {bnNumber(pkg?._count?.userPackages)} জন</span>
                    </div>
                </div>
            ))}
         </div>
        </div>
    );
};

export default MyPackages;