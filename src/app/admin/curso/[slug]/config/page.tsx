'use client';

import { useParams } from 'next/navigation';
import CourseConfigPage from '@/components/CourseConfigPage';

export default function AdminCourseConfigPageWrapper() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <CourseConfigPage
      slug={slug}
      backUrl="/admin"
      backLabel="Volver al Admin"
    />
  );
}
