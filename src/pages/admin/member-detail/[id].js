'use client';
import { useRouter } from 'next/router';
import MemberDetail from '../../../components/dashboard/MemberDetail';

export default function MemberDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  console.log("mamber-id::", id);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the member details.</p>
        </div>
      </div>
    );
  }

  return <MemberDetail memberId={id} />;
}

