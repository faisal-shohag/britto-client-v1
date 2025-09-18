import { useParams } from 'react-router';
import  ExamManagement  from './Exams';

export default function PackageExamsPage() {
  const params = useParams()
  const packageId = parseInt(params.id as string)
  
  return (
    <ExamManagement 
      packageId={packageId}
    />
  );
}