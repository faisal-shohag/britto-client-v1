import { usePackagesByUser } from '@/hooks/free-exam-hooks/use-packages';
import { bnNumber } from '@/lib/bnNumbers';
import { BsFillBackpackFill } from "react-icons/bs";
import { Spinner } from './Splash';
import useFreeUser from '@/hooks/free-exam-hooks/use-free-user';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
const MyPackages = () => {
    const user = useFreeUser()
    const { data: packages, isLoading } = usePackagesByUser(user.id);
    
    if (isLoading) return <div>
       <Spinner/>
    </div>;

    
    return (
        <div className='space-y-2 bg-white p-3 dark:bg-zinc-900 border rounded-xl'>
            <div className='flex items-center gap-1 bg-gradient-to-r px-2 py-1 rounded-xl'>
                <span><BsFillBackpackFill /></span>
                <h1>আমার এক্সাম প্যাকেজ</h1>
            </div>
         <div className=''>
               {packages?.map(pkg => (
                <Link key={pkg.id} to={`package/${pkg.id}`}>
                <div className='relative bg-white dark:bg-zinc-900 border  rounded-xl
               flex justify-between items-center pr-2' >
              <div className='flex items-center gap-2'>
                  <div>
                    <img className='w-[50px] h-[50px]  rounded-xl border' src={pkg.image} alt={pkg.title}/>
                </div>
                  <div>
                      <h3 className='font-semibold text-sm'>{pkg.title}</h3>
                      <div className='flex items-center gap-2 text-xs'>
                        <span>পরীক্ষা: {bnNumber(pkg._count?.freeExams)} টি</span> |
                        <span>অংশগ্রহণ: {bnNumber(pkg?._count?.userPackages)} জন</span>
                    </div>
                  </div>  
                </div> 

                  <div className='float-right'>
                    <ChevronRight/>
                    </div>                 
                </div>
                </Link>
            ))}
         </div>
        </div>
    );
};

export default MyPackages;