import type { UserRole, DashboardStats, RecentActivity, Client, JobRequirement, Candidate, Interview, Placement, User, Notification } from './types';

// ==================== MOCK USERS ====================
export const MOCK_USERS: User[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'superadmin@crm.com', password: 'admin123', role: 'super_admin', phone: '+91 98765 43210', department: 'Management', isActive: true, createdAt: '2025-01-01', updatedAt: '2025-06-01' },
  { id: '2', name: 'Priya Sharma', email: 'itadmin@crm.com', password: 'admin123', role: 'it_admin', phone: '+91 98765 43211', department: 'IT', isActive: true, createdAt: '2025-01-15', updatedAt: '2025-06-01' },
  { id: '3', name: 'Arun Patel', email: 'admin@crm.com', password: 'admin123', role: 'admin', phone: '+91 98765 43212', department: 'Operations', isActive: true, createdAt: '2025-02-01', updatedAt: '2025-06-01' },
  { id: '4', name: 'Sneha Reddy', email: 'crm@crm.com', password: 'admin123', role: 'placement_coordinator', phone: '+91 98765 43213', department: 'CRM', isActive: true, createdAt: '2025-02-15', updatedAt: '2025-06-01' },
  { id: '5', name: 'Vikram Singh', email: 'recruiter@crm.com', password: 'admin123', role: 'recruiter', phone: '+91 98765 43214', department: 'Recruitment', isActive: true, createdAt: '2025-03-01', updatedAt: '2025-06-01' },
  { id: '6', name: 'Deepika Nair', email: 'interviewer@crm.com', password: 'admin123', role: 'interviewer', phone: '+91 98765 43215', department: 'Technical', isActive: true, createdAt: '2025-03-15', updatedAt: '2025-06-01' },
  { id: '7', name: 'Kavitha Menon', email: 'hr@crm.com', password: 'admin123', role: 'hr', phone: '+91 98765 43216', department: 'Human Resources', isActive: true, createdAt: '2025-04-01', updatedAt: '2025-06-01' },
  { id: '8', name: 'TechCorp Solutions', email: 'client@crm.com', password: 'admin123', role: 'client', phone: '+91 98765 43217', department: 'Client', isActive: true, createdAt: '2025-04-15', updatedAt: '2025-06-01' },
  { id: '9', name: 'Rahul Verma', email: 'dev@crm.com', password: 'admin123', role: 'developer', phone: '+91 98765 43218', department: 'Development', isActive: true, createdAt: '2025-05-01', updatedAt: '2025-06-01' },
  { id: '10', name: 'Anita Gupta', email: 'tester@crm.com', password: 'admin123', role: 'tester', phone: '+91 98765 43219', department: 'QA', isActive: true, createdAt: '2025-05-15', updatedAt: '2025-06-01' },
];

// ==================== MOCK CLIENTS ====================
export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', companyName: 'TechCorp Solutions', contactPerson: 'Amit Joshi', email: 'amit@techcorp.com', phone: '+91 98765 11111', address: 'Bangalore, Karnataka', industry: 'IT Services', website: 'https://techcorp.com', status: 'active', notes: 'Premium client, long-term partnership', createdAt: '2025-01-10', updatedAt: '2025-06-01' },
  { id: 'c2', companyName: 'InnovateTech Pvt Ltd', contactPerson: 'Meera Kapoor', email: 'meera@innovatetech.in', phone: '+91 98765 22222', address: 'Hyderabad, Telangana', industry: 'Software Development', website: 'https://innovatetech.in', status: 'active', notes: 'Fast-growing startup, multiple requirements', createdAt: '2025-02-15', updatedAt: '2025-06-01' },
  { id: 'c3', companyName: 'GlobalFinance Inc', contactPerson: 'Suresh Menon', email: 'suresh@globalfinance.com', phone: '+91 98765 33333', address: 'Mumbai, Maharashtra', industry: 'Banking & Finance', website: 'https://globalfinance.com', status: 'active', notes: 'Requires candidates with BFSI experience', createdAt: '2025-03-01', updatedAt: '2025-06-01' },
  { id: 'c4', companyName: 'HealthPlus Systems', contactPerson: 'Dr. Ramesh', email: 'ramesh@healthplus.com', phone: '+91 98765 44444', address: 'Chennai, Tamil Nadu', industry: 'Healthcare IT', status: 'active', createdAt: '2025-03-20', updatedAt: '2025-06-01' },
  { id: 'c5', companyName: 'EduLearn Technologies', contactPerson: 'Pooja Mehta', email: 'pooja@edulearn.com', phone: '+91 98765 55555', address: 'Pune, Maharashtra', industry: 'EdTech', status: 'inactive', notes: 'Paused requirements temporarily', createdAt: '2025-04-10', updatedAt: '2025-06-01' },
  { id: 'c6', companyName: 'CloudNine Infra', contactPerson: 'Karthik R', email: 'karthik@cloudnine.io', phone: '+91 98765 66666', address: 'Bangalore, Karnataka', industry: 'Cloud Infrastructure', website: 'https://cloudnine.io', status: 'active', createdAt: '2025-05-01', updatedAt: '2025-06-01' },
];

// ==================== MOCK JOB REQUIREMENTS ====================
export const MOCK_REQUIREMENTS: JobRequirement[] = [
  { id: 'r1', clientId: 'c1', clientName: 'TechCorp Solutions', title: 'Senior React Developer', description: 'Looking for an experienced React developer with 5+ years experience in building large-scale applications.', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], experience: '5-8 years', positions: 3, filledPositions: 1, location: 'Bangalore', salaryRange: '₹18-25 LPA', status: 'in_progress', priority: 'high', assignedRecruiters: ['5'], deadline: '2025-08-15', createdAt: '2025-05-01', updatedAt: '2025-06-15' },
  { id: 'r2', clientId: 'c2', clientName: 'InnovateTech Pvt Ltd', title: 'Full Stack Engineer', description: 'Need full stack engineers proficient in MERN stack for product development.', skills: ['MongoDB', 'Express', 'React', 'Node.js'], experience: '3-5 years', positions: 5, filledPositions: 2, location: 'Hyderabad', salaryRange: '₹12-18 LPA', status: 'open', priority: 'urgent', assignedRecruiters: ['5'], deadline: '2025-07-30', createdAt: '2025-05-10', updatedAt: '2025-06-20' },
  { id: 'r3', clientId: 'c3', clientName: 'GlobalFinance Inc', title: 'Java Backend Developer', description: 'Experienced Java developer with Spring Boot and microservices architecture knowledge.', skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'], experience: '4-7 years', positions: 2, filledPositions: 0, location: 'Mumbai', salaryRange: '₹15-22 LPA', status: 'open', priority: 'medium', assignedRecruiters: [], deadline: '2025-09-01', createdAt: '2025-05-20', updatedAt: '2025-06-01' },
  { id: 'r4', clientId: 'c4', clientName: 'HealthPlus Systems', title: 'DevOps Engineer', description: 'DevOps engineer with expertise in CI/CD, Docker, Kubernetes, and cloud platforms.', skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'], experience: '3-6 years', positions: 2, filledPositions: 1, location: 'Chennai', salaryRange: '₹14-20 LPA', status: 'in_progress', priority: 'high', assignedRecruiters: ['5'], deadline: '2025-08-01', createdAt: '2025-06-01', updatedAt: '2025-06-25' },
  { id: 'r5', clientId: 'c1', clientName: 'TechCorp Solutions', title: 'UI/UX Designer', description: 'Creative UI/UX designer with strong portfolio and experience in design systems.', skills: ['Figma', 'Adobe XD', 'Design Systems', 'Prototyping'], experience: '2-5 years', positions: 1, filledPositions: 0, location: 'Bangalore', salaryRange: '₹10-15 LPA', status: 'open', priority: 'low', assignedRecruiters: [], deadline: '2025-09-15', createdAt: '2025-06-10', updatedAt: '2025-06-10' },
  { id: 'r6', clientId: 'c6', clientName: 'CloudNine Infra', title: 'Python Data Engineer', description: 'Data engineer skilled in Python, Spark, and data pipeline development.', skills: ['Python', 'Apache Spark', 'SQL', 'Airflow', 'AWS'], experience: '4-7 years', positions: 3, filledPositions: 0, location: 'Bangalore', salaryRange: '₹16-24 LPA', status: 'open', priority: 'high', assignedRecruiters: ['5'], deadline: '2025-08-20', createdAt: '2025-06-15', updatedAt: '2025-06-15' },
  { id: 'r7', clientId: 'c2', clientName: 'InnovateTech Pvt Ltd', title: 'QA Automation Engineer', description: 'QA engineer with Selenium, Cypress, and API testing experience.', skills: ['Selenium', 'Cypress', 'REST API Testing', 'Java'], experience: '2-4 years', positions: 2, filledPositions: 2, location: 'Hyderabad', salaryRange: '₹8-14 LPA', status: 'closed', priority: 'medium', assignedRecruiters: ['5'], deadline: '2025-06-30', createdAt: '2025-04-01', updatedAt: '2025-06-30' },
];

// ==================== MOCK CANDIDATES ====================
export const MOCK_CANDIDATES: Candidate[] = [
  { id: 'ca1', name: 'Arjun Krishnan', email: 'arjun.k@gmail.com', phone: '+91 99876 11111', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], experience: '6 years', education: 'B.Tech Computer Science, IIT Madras', currentCompany: 'Infosys', currentRole: 'Senior Developer', expectedSalary: '₹22 LPA', location: 'Bangalore', status: 'shortlisted', appliedFor: 'r1', createdAt: '2025-05-05', updatedAt: '2025-06-15' },
  { id: 'ca2', name: 'Neha Sharma', email: 'neha.s@gmail.com', phone: '+91 99876 22222', skills: ['MongoDB', 'Express', 'React', 'Node.js', 'Python'], experience: '4 years', education: 'MCA, Delhi University', currentCompany: 'TCS', currentRole: 'Full Stack Developer', expectedSalary: '₹16 LPA', location: 'Delhi', status: 'interview_scheduled', appliedFor: 'r2', createdAt: '2025-05-12', updatedAt: '2025-06-20' },
  { id: 'ca3', name: 'Sanjay Gupta', email: 'sanjay.g@gmail.com', phone: '+91 99876 33333', skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker'], experience: '5 years', education: 'B.E. IT, BITS Pilani', currentCompany: 'Wipro', currentRole: 'Backend Developer', expectedSalary: '₹20 LPA', location: 'Mumbai', status: 'new', appliedFor: 'r3', createdAt: '2025-06-01', updatedAt: '2025-06-01' },
  { id: 'ca4', name: 'Ritu Desai', email: 'ritu.d@gmail.com', phone: '+91 99876 44444', skills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS'], experience: '4 years', education: 'B.Tech CS, NIT Trichy', currentCompany: 'Cognizant', currentRole: 'DevOps Engineer', expectedSalary: '₹18 LPA', location: 'Chennai', status: 'selected', appliedFor: 'r4', createdAt: '2025-06-05', updatedAt: '2025-06-28' },
  { id: 'ca5', name: 'Manish Tiwari', email: 'manish.t@gmail.com', phone: '+91 99876 55555', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], experience: '7 years', education: 'M.Tech CS, IISc Bangalore', currentCompany: 'Flipkart', currentRole: 'Senior Frontend Engineer', expectedSalary: '₹28 LPA', location: 'Bangalore', status: 'offered', appliedFor: 'r1', createdAt: '2025-05-08', updatedAt: '2025-06-25' },
  { id: 'ca6', name: 'Swathi Iyer', email: 'swathi.i@gmail.com', phone: '+91 99876 66666', skills: ['Python', 'Apache Spark', 'SQL', 'Airflow', 'GCP'], experience: '5 years', education: 'B.Tech CS, VIT', currentCompany: 'Amazon', currentRole: 'Data Engineer', expectedSalary: '₹24 LPA', location: 'Hyderabad', status: 'new', appliedFor: 'r6', createdAt: '2025-06-18', updatedAt: '2025-06-18' },
  { id: 'ca7', name: 'Rohit Malhotra', email: 'rohit.m@gmail.com', phone: '+91 99876 77777', skills: ['Selenium', 'Cypress', 'API Testing', 'Java', 'Python'], experience: '3 years', education: 'B.Tech IT, Anna University', currentCompany: 'HCL', currentRole: 'QA Engineer', expectedSalary: '₹12 LPA', location: 'Hyderabad', status: 'joined', appliedFor: 'r7', createdAt: '2025-04-15', updatedAt: '2025-06-30' },
  { id: 'ca8', name: 'Preethi Rajan', email: 'preethi.r@gmail.com', phone: '+91 99876 88888', skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'HTML/CSS'], experience: '3 years', education: 'B.Des, NID Ahmedabad', currentCompany: 'Freshworks', currentRole: 'UI/UX Designer', expectedSalary: '₹14 LPA', location: 'Chennai', status: 'new', appliedFor: 'r5', createdAt: '2025-06-12', updatedAt: '2025-06-12' },
  { id: 'ca9', name: 'Kiran Naidu', email: 'kiran.n@gmail.com', phone: '+91 99876 99999', skills: ['React', 'Vue.js', 'Node.js', 'PostgreSQL'], experience: '4 years', education: 'B.Tech CS, JNTU', currentCompany: 'Accenture', currentRole: 'Software Engineer', expectedSalary: '₹15 LPA', location: 'Hyderabad', status: 'interviewed', appliedFor: 'r2', createdAt: '2025-05-20', updatedAt: '2025-06-22' },
  { id: 'ca10', name: 'Divya Krishnamurthy', email: 'divya.k@gmail.com', phone: '+91 99876 10101', skills: ['Java', 'Kotlin', 'Spring Boot', 'Microservices'], experience: '6 years', education: 'M.Tech, IIT Bombay', currentCompany: 'Razorpay', currentRole: 'Senior Backend Developer', expectedSalary: '₹25 LPA', location: 'Bangalore', status: 'shortlisted', appliedFor: 'r3', createdAt: '2025-06-02', updatedAt: '2025-06-20' },
];

// ==================== MOCK INTERVIEWS ====================
export const MOCK_INTERVIEWS: Interview[] = [
  { id: 'i1', candidateId: 'ca2', candidateName: 'Neha Sharma', requirementId: 'r2', requirementTitle: 'Full Stack Engineer', interviewerId: '6', interviewerName: 'Deepika Nair', scheduledAt: '2025-07-05T10:00:00', duration: 60, type: 'technical', status: 'scheduled', createdAt: '2025-06-20', updatedAt: '2025-06-20' },
  { id: 'i2', candidateId: 'ca1', candidateName: 'Arjun Krishnan', requirementId: 'r1', requirementTitle: 'Senior React Developer', interviewerId: '6', interviewerName: 'Deepika Nair', scheduledAt: '2025-07-03T14:00:00', duration: 45, type: 'technical', status: 'scheduled', createdAt: '2025-06-18', updatedAt: '2025-06-18' },
  { id: 'i3', candidateId: 'ca5', candidateName: 'Manish Tiwari', requirementId: 'r1', requirementTitle: 'Senior React Developer', interviewerId: '6', interviewerName: 'Deepika Nair', scheduledAt: '2025-06-20T11:00:00', duration: 60, type: 'technical', status: 'completed', feedback: 'Excellent technical skills, strong system design knowledge. Highly recommended.', rating: 5, recommendation: 'select', createdAt: '2025-06-15', updatedAt: '2025-06-20' },
  { id: 'i4', candidateId: 'ca4', candidateName: 'Ritu Desai', requirementId: 'r4', requirementTitle: 'DevOps Engineer', interviewerId: '6', interviewerName: 'Deepika Nair', scheduledAt: '2025-06-22T15:00:00', duration: 45, type: 'technical', status: 'completed', feedback: 'Good knowledge of CI/CD and cloud platforms. Can improve on Kubernetes.', rating: 4, recommendation: 'select', createdAt: '2025-06-18', updatedAt: '2025-06-22' },
  { id: 'i5', candidateId: 'ca9', candidateName: 'Kiran Naidu', requirementId: 'r2', requirementTitle: 'Full Stack Engineer', interviewerId: '6', interviewerName: 'Deepika Nair', scheduledAt: '2025-06-25T10:30:00', duration: 60, type: 'technical', status: 'completed', feedback: 'Average technical skills. Needs more experience with backend systems.', rating: 3, recommendation: 'hold', createdAt: '2025-06-20', updatedAt: '2025-06-25' },
  { id: 'i6', candidateId: 'ca7', candidateName: 'Rohit Malhotra', requirementId: 'r7', requirementTitle: 'QA Automation Engineer', interviewerId: '6', interviewerName: 'Deepika Nair', scheduledAt: '2025-05-15T09:00:00', duration: 45, type: 'technical', status: 'completed', feedback: 'Strong automation skills, good knowledge of testing frameworks.', rating: 4, recommendation: 'select', createdAt: '2025-05-10', updatedAt: '2025-05-15' },
];

// ==================== MOCK PLACEMENTS ====================
export const MOCK_PLACEMENTS: Placement[] = [
  { id: 'p1', candidateId: 'ca5', candidateName: 'Manish Tiwari', requirementId: 'r1', requirementTitle: 'Senior React Developer', clientId: 'c1', clientName: 'TechCorp Solutions', position: 'Senior React Developer', salary: '₹25 LPA', joiningDate: '2025-07-15', status: 'offer_accepted', createdAt: '2025-06-25', updatedAt: '2025-06-28' },
  { id: 'p2', candidateId: 'ca4', candidateName: 'Ritu Desai', requirementId: 'r4', requirementTitle: 'DevOps Engineer', clientId: 'c4', clientName: 'HealthPlus Systems', position: 'DevOps Engineer', salary: '₹18 LPA', joiningDate: '2025-07-20', status: 'joining_confirmed', createdAt: '2025-06-28', updatedAt: '2025-07-01' },
  { id: 'p3', candidateId: 'ca7', candidateName: 'Rohit Malhotra', requirementId: 'r7', requirementTitle: 'QA Automation Engineer', clientId: 'c2', clientName: 'InnovateTech Pvt Ltd', position: 'QA Automation Engineer', salary: '₹12 LPA', joiningDate: '2025-06-15', status: 'joined', createdAt: '2025-06-01', updatedAt: '2025-06-15' },
];

// ==================== MOCK NOTIFICATIONS ====================
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: '5', title: 'New Requirement Assigned', message: 'You have been assigned to "Python Data Engineer" requirement by CloudNine Infra.', type: 'info', isRead: false, link: '/requirements/r6', createdAt: '2025-07-01T10:00:00' },
  { id: 'n2', userId: '6', title: 'Interview Scheduled', message: 'Interview with Neha Sharma for Full Stack Engineer role on July 5, 2025.', type: 'info', isRead: false, link: '/interviews/i1', createdAt: '2025-07-01T09:00:00' },
  { id: 'n3', userId: '7', title: 'Candidate Selected', message: 'Ritu Desai has been selected for DevOps Engineer at HealthPlus Systems.', type: 'success', isRead: false, link: '/placements/p2', createdAt: '2025-06-30T16:00:00' },
  { id: 'n4', userId: '1', title: 'Monthly Report Ready', message: 'June 2025 recruitment report is ready for review.', type: 'info', isRead: true, link: '/reports', createdAt: '2025-07-01T08:00:00' },
  { id: 'n5', userId: '3', title: 'Requirement Deadline Approaching', message: 'Full Stack Engineer requirement deadline is July 30, 2025.', type: 'warning', isRead: false, link: '/requirements/r2', createdAt: '2025-07-01T07:00:00' },
];

// ==================== DASHBOARD STATS ====================
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalClients: 6,
  activeRequirements: 5,
  totalCandidates: 10,
  scheduledInterviews: 2,
  placements: 3,
  openPositions: 12,
  thisMonthPlacements: 2,
  thisMonthInterviews: 4,
};

// ==================== RECENT ACTIVITIES ====================
export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  { id: 'a1', type: 'placement', action: 'Placement Confirmed', description: 'Ritu Desai joining confirmed at HealthPlus Systems', user: 'Kavitha Menon', timestamp: '2025-07-01T14:30:00' },
  { id: 'a2', type: 'interview', action: 'Interview Scheduled', description: 'Neha Sharma interview for Full Stack Engineer', user: 'Vikram Singh', timestamp: '2025-07-01T11:00:00' },
  { id: 'a3', type: 'candidate', action: 'Candidate Shortlisted', description: 'Divya Krishnamurthy shortlisted for Java Backend Developer', user: 'Vikram Singh', timestamp: '2025-07-01T09:45:00' },
  { id: 'a4', type: 'requirement', action: 'New Requirement', description: 'Python Data Engineer requirement added by CloudNine Infra', user: 'Sneha Reddy', timestamp: '2025-06-30T16:00:00' },
  { id: 'a5', type: 'client', action: 'Client Added', description: 'CloudNine Infra registered as new client', user: 'Sneha Reddy', timestamp: '2025-06-30T14:00:00' },
  { id: 'a6', type: 'placement', action: 'Offer Accepted', description: 'Manish Tiwari accepted offer from TechCorp Solutions', user: 'Kavitha Menon', timestamp: '2025-06-28T10:00:00' },
  { id: 'a7', type: 'interview', action: 'Interview Completed', description: 'Kiran Naidu completed interview for Full Stack Engineer', user: 'Deepika Nair', timestamp: '2025-06-25T11:30:00' },
];

// ==================== CHART DATA ====================
export const MONTHLY_PLACEMENT_DATA = [
  { month: 'Jan', placements: 5, interviews: 18 },
  { month: 'Feb', placements: 8, interviews: 22 },
  { month: 'Mar', placements: 6, interviews: 20 },
  { month: 'Apr', placements: 10, interviews: 28 },
  { month: 'May', placements: 12, interviews: 35 },
  { month: 'Jun', placements: 9, interviews: 30 },
  { month: 'Jul', placements: 3, interviews: 12 },
];

export const REQUIREMENT_STATUS_DATA = [
  { name: 'Open', value: 4, color: '#22c55e' },
  { name: 'In Progress', value: 2, color: '#3b82f6' },
  { name: 'Closed', value: 1, color: '#6b7280' },
];

export const TOP_SKILLS_DATA = [
  { skill: 'React', count: 45 },
  { skill: 'Node.js', count: 38 },
  { skill: 'Python', count: 32 },
  { skill: 'Java', count: 28 },
  { skill: 'AWS', count: 25 },
  { skill: 'TypeScript', count: 22 },
  { skill: 'Docker', count: 18 },
];
