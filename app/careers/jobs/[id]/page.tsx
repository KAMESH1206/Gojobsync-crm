import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import JobDetailsClient from '@/components/JobDetailsClient';

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.jobRequirement.findUnique({
    where: { id },
    include: { client: true }
  });

  if (!job) return notFound();

  // Find similar jobs
  const similarJobs = await prisma.jobRequirement.findMany({
    where: {
      status: 'open',
      id: { not: job.id },
      clientId: job.clientId
    },
    include: { client: true },
    take: 3
  });

  let skills: string[] = [];
  try {
    skills = JSON.parse(job.skills);
  } catch { }

  const companyInitial = (job.client?.companyName || 'C')[0].toUpperCase();
  const hue = job.client?.companyName ? [...job.client.companyName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360 : 200;

  return (
    <JobDetailsClient 
      job={job} 
      similarJobs={similarJobs} 
      skills={skills} 
      companyInitial={companyInitial} 
      hue={hue} 
    />
  );
}
