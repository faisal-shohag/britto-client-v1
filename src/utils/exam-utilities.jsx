import {Badge} from '@/components/ui/badge.tsx'
import { GoDotFill } from "react-icons/go";
export const examStatusBadge = (startTime, endTime) => {
  const now = new Date();

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now >= start && now <= end) {
    return <Badge className="bg-red-500/25  border-red-300 text-red-500"><GoDotFill className='animate-ping'/> লাইভ</Badge>;
  } else if (now < start) {
    return <Badge className="bg-orange-500/25 border-orange-300 text-orange-500">আপকামিং</Badge>;
  } else {
    return <Badge className="bg-green-400/25  border-green-300 text-green-800">শেষ</Badge>;;
  }
};


export const examStatus = (startTime, endTime) => {
  const now = new Date();

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now >= start && now <= end) {
    return "Live";
  } else if (now < start) {
    return "Upcoming";
  } 

  return "finished"
};

