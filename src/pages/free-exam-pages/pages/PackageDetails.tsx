import useFreeUser from "@/hooks/free-exam-hooks/use-free-user";
import { RecentExams } from "../admin/exams/RecentExams";
import { useParams } from "react-router";
import { usePackage } from "@/hooks/free-exam-hooks/use-packages";
import { bnNumber } from "@/lib/bnNumbers";

const PackageDetails = () => {
  const user = useFreeUser();
  const { id: packageId } = useParams() as any;
  const { data: pkg, isLoading } = usePackage(packageId) as any;
  if (isLoading) return <div>Loading...</div>;
//   console.log(pkg);
  return (
    <div>
      <div
        style={{ backgroundImage: `url('${pkg.image}')` }}
        className={` border rounded-xl  p-3 text-center  bg-cover bg-no-repeat bg-center mb-3`}
      >
        <div className="bg-white/70 dark:bg-black/70 rounded-xl border ">
            <h1 className="text-xl font-bold">{pkg.title}</h1>
        <div className="flex justify-center items-center gap-2 ">
          <span>পরীক্ষা: {bnNumber(pkg._count?.freeExams)} টি</span> |
          <span>অংশগ্রহণ: {bnNumber(pkg?._count?.userPackages)} জন</span>
        </div>
        </div>
      </div>
      <RecentExams packageId={packageId} userId={user.id} />
    </div>
  );
};

export default PackageDetails;
