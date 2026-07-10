const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const candidates = [
    { name: 'Arun Kumar', email: 'arun@gmail.com', phone: '9876543210', skills: '["React","Node.js","TypeScript"]', experience: '3 years', education: 'B.Tech CSE', location: 'Chennai', status: 'new', resumeUrl: '/uploads/arun_resume.pdf' },
    { name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9876543211', skills: '["Python","Django","AWS"]', experience: '5 years', education: 'M.Tech IT', location: 'Bangalore', status: 'shortlisted', resumeUrl: '/uploads/priya_resume.pdf', currentCompany: 'TCS', currentRole: 'Senior Developer' },
    { name: 'Rajesh Verma', email: 'rajesh@gmail.com', phone: '9876543212', skills: '["Java","Spring Boot","MySQL"]', experience: '4 years', education: 'B.Tech CSE', location: 'Hyderabad', status: 'interview_scheduled', resumeUrl: '/uploads/rajesh_resume.pdf', currentCompany: 'Infosys', currentRole: 'Software Engineer' },
    { name: 'Sneha Reddy', email: 'sneha@gmail.com', phone: '9876543213', skills: '["Flutter","Dart","Firebase"]', experience: '2 years', education: 'B.Sc Computer Science', location: 'Chennai', status: 'new', resumeUrl: '/uploads/sneha_resume.pdf' },
    { name: 'Vikram Singh', email: 'vikram@gmail.com', phone: '9876543214', skills: '["Angular","C#",".NET"]', experience: '6 years', education: 'MCA', location: 'Pune', status: 'selected', resumeUrl: '/uploads/vikram_resume.pdf', currentCompany: 'Wipro', currentRole: 'Tech Lead' },
    { name: 'Deepa Nair', email: 'deepa@gmail.com', phone: '9876543215', skills: '["UI/UX","Figma","Adobe XD"]', experience: '3 years', education: 'B.Des', location: 'Kochi', status: 'new', resumeUrl: '/uploads/deepa_resume.pdf' },
    { name: 'Mohammed Faisal', email: 'faisal@gmail.com', phone: '9876543216', skills: '["DevOps","Docker","Kubernetes","AWS"]', experience: '5 years', education: 'B.Tech IT', location: 'Mumbai', status: 'shortlisted', resumeUrl: '/uploads/faisal_resume.pdf', currentCompany: 'Accenture', currentRole: 'DevOps Engineer' },
    { name: 'Kavitha Murugan', email: 'kavitha@gmail.com', phone: '9876543217', skills: '["Data Science","Python","ML","TensorFlow"]', experience: '4 years', education: 'M.Sc Data Science', location: 'Coimbatore', status: 'new', resumeUrl: '/uploads/kavitha_resume.pdf' },
    { name: 'Suresh Babu', email: 'suresh@gmail.com', phone: '9876543218', skills: '["PHP","Laravel","WordPress"]', experience: '7 years', education: 'BCA', location: 'Madurai', status: 'rejected', resumeUrl: '/uploads/suresh_resume.pdf', currentCompany: 'Zoho', currentRole: 'Full Stack Developer' },
    { name: 'Anitha Lakshmi', email: 'anitha@gmail.com', phone: '9876543219', skills: '["React Native","JavaScript","Redux"]', experience: '2 years', education: 'B.Tech ECE', location: 'Trichy', status: 'new', resumeUrl: '/uploads/anitha_resume.pdf' },
  ];

  for (const c of candidates) {
    await p.candidate.create({ data: c });
    console.log('Added:', c.name);
  }

  console.log('\nAll 10 candidates added successfully!');
}

main().catch(console.error).finally(() => p.$disconnect());
