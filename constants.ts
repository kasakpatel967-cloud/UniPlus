
import { CampusEvent, Department, Notification, Scholarship, Assignment, Club, StudyGroup, SharedNote, Sport, BorrowedBook } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    slots: [
      { id: 'cs1', subject: 'Data Structures', faculty: 'Dr. Smith', startTime: '09:00', endTime: '10:30', room: 'Lab 101', day: 'Monday' },
      { id: 'cs2', subject: 'Cloud Computing', faculty: 'Prof. Garcia', startTime: '11:00', endTime: '12:30', room: 'Hall A', day: 'Monday' },
      { id: 'cs3', subject: 'OS Concepts', faculty: 'Dr. Miller', startTime: '14:00', endTime: '15:30', room: 'LHC-2', day: 'Tuesday' },
      { id: 'cs4', subject: 'Web Architecture', faculty: 'Prof. Chen', startTime: '10:00', endTime: '11:30', room: 'IT Lab', day: 'Wednesday' },
    ]
  },
  { id: 'ec', name: 'EC', slots: [
    { id: 'ec1', subject: 'Analog Electronics', faculty: 'Dr. Patel', startTime: '09:00', endTime: '10:30', room: 'EC Hall 1', day: 'Monday' },
    { id: 'ec2', subject: 'Digital Communication', faculty: 'Prof. Shah', startTime: '11:00', endTime: '12:30', room: 'LHC-5', day: 'Monday' },
  ] },
  { id: 'el', name: 'EL', slots: [
    { id: 'el1', subject: 'Power Systems', faculty: 'Dr. Desai', startTime: '10:00', endTime: '11:30', room: 'Power Lab', day: 'Monday' },
  ] },
  { id: 'it', name: 'IT', slots: [
    { id: 'it1', subject: 'Cyber Security', faculty: 'Dr. Bhatt', startTime: '09:00', endTime: '10:30', room: 'IT Lab 2', day: 'Monday' },
  ] },
  { id: 'mech', name: 'Mech', slots: [
    { id: 'me1', subject: 'Thermodynamics', faculty: 'Dr. Rathod', startTime: '11:00', endTime: '12:30', room: 'ME Hall 3', day: 'Monday' },
  ] }
];

export const EVENTS: CampusEvent[] = [
  {
    id: 'e1',
    title: 'Hackathon 2025',
    description: 'A 24-hour coding challenge to solve real-world problems. Prizes worth ₹50k up for grabs!',
    date: '2025-06-15',
    time: '09:00 AM',
    venue: 'Main Auditorium',
    category: 'Technical',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    registrationLink: '#'
  },
  {
    id: 'e2',
    title: 'Cultural Fest: Udaan',
    description: 'BVM\'s annual cultural celebration featuring dance, music, and art performances.',
    date: '2025-06-20',
    time: '10:00 AM',
    venue: 'Open Air Theater',
    category: 'Cultural',
    imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800',
    registrationLink: '#'
  },
  {
    id: 'e3',
    title: 'Robo-Race Challenge',
    description: 'Build and race your own robots on our high-speed track.',
    date: '2025-06-05',
    time: '02:00 PM',
    venue: 'Mechanical Hall',
    category: 'Technical',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    registrationLink: '#'
  }
];

export const SPORTS: Sport[] = [
  {
    id: 's1',
    name: 'Cricket',
    description: 'BVM\'s flagship sports team. Known for strategic gameplay and competitive spirit.',
    coach: 'Dr. K. S. Gandhi',
    time: '04:30 PM - 06:30 PM',
    venue: 'BVM Sports Ground',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
    members: 22
  },
  {
    id: 's2',
    name: 'Basketball',
    description: 'Fast-paced action and precision. Join the squad for intense drills and tournaments.',
    coach: 'Prof. R. M. Shah',
    time: '05:00 PM - 07:00 PM',
    venue: 'Basketball Courts',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    members: 15
  },
  {
    id: 's3',
    name: 'Football',
    description: 'Experience the beautiful game. Focus on tactical training and stamina building.',
    coach: 'Dr. M. S. Holia',
    time: '04:00 PM - 06:00 PM',
    venue: 'Main Field',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    members: 30
  },
  {
    id: 's4',
    name: 'Badminton',
    description: 'Reflexes, agility, and power. Indoor court sessions for all skill levels.',
    coach: 'Prof. A. A. Pandya',
    time: '06:00 AM - 08:00 AM',
    venue: 'Gymkhana Hall',
    imageUrl: 'https://images.unsplash.com/photo-1626225967045-9410dd99fae4?auto=format&fit=crop&q=80&w=800',
    members: 12
  }
];

export const MOCK_BORROWED_BOOKS: BorrowedBook[] = [
  {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    borrowDate: '2025-05-10',
    dueDate: '2025-05-24',
    category: 'Computer Science',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
    status: 'Borrowed'
  },
  {
    id: 'b2',
    title: 'Digital Signal Processing',
    author: 'John G. Proakis',
    borrowDate: '2025-04-15',
    dueDate: '2025-05-01',
    category: 'Electronics',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    status: 'Overdue'
  },
  {
    id: 'b3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    borrowDate: '2025-05-18',
    dueDate: '2025-06-01',
    category: 'Fiction',
    coverImage: 'https://images.unsplash.com/photo-1543004471-240ce47396b1?auto=format&fit=crop&q=80&w=800',
    status: 'Renewed'
  }
];

export const MOCK_NOTES: SharedNote[] = [
  { id: 'n1', title: 'Data Structures Handouts', type: 'pdf', sender: 'Radhika', timestamp: '2h ago', size: '2.4 MB' },
  { id: 'n2', title: 'Lab 4 Simulation Video', type: 'video', sender: 'Aryan', timestamp: '5h ago', size: '15.8 MB' },
  { id: 'n3', title: 'Circuit Diagram Snapshot', type: 'image', sender: 'Sanya', timestamp: '1d ago', size: '1.1 MB' },
  { id: 'n4', title: 'GDGC Workshop Slides', type: 'pdf', sender: 'Tushar', timestamp: '3h ago', size: '4.2 MB' }
];

export const STUDY_GROUPS: StudyGroup[] = [
  { id: 'algo', name: 'Algo Knights', subject: 'Algorithms', members: 12, isPrivate: false, notes: [...MOCK_NOTES] },
  { id: 'cloud', name: 'Cloud Architects', subject: 'AWS/GCP', members: 5, isPrivate: true, notes: [MOCK_NOTES[0]] }
];

export const SCHOLARSHIPS: Scholarship[] = [
  { id: 's1', title: 'Merit Excellence Award', provider: 'Alumni Association', amount: '₹4,00,000', deadline: '2025-08-01', description: 'Awarded to top 5% students in each department.' },
  { id: 's2', title: 'Need-based Financial Aid', provider: 'State Trust', amount: '₹1,50,000', deadline: '2025-07-15', description: 'Support for students from low-income backgrounds.' }
];

export const CLUBS: Club[] = [
  { id: 'c1', name: 'NSS', type: 'Compulsory', description: 'National Service Scheme - Not me but you. Community service and social development.' },
  { id: 'c2', name: 'YOGA', type: 'Compulsory', description: 'Ancient practice for physical and mental well-being.' },
  { id: 'c0', name: 'NCC', type: 'Compulsory', description: 'National Cadet Corps - Unity and Discipline. Training future leaders and disciplined citizens.' },
  { id: 'c3', name: 'GDGC BVM', type: 'Chapter', description: 'Google Developer Groups on Campus - Empowering students with cutting edge tech.' },
  { id: 'c4', name: 'AWS Cloud Club', type: 'Chapter', description: 'Amazon Web Services student club focused on cloud computing and certification.' },
  { id: 'c5', name: 'MLSC', type: 'Chapter', description: 'Microsoft Learn Student Chapter - Learning and growing with Microsoft technologies.' },
  { id: 'c6', name: 'IEEE BVM', type: 'Chapter', description: 'Professional association for electrical and electronic engineering.' }
];

export const ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Red-Black Trees Implementation', dueDate: '2025-05-20', subject: 'Data Structures', department: 'Computer Science' },
  { id: 'a2', title: 'System Analysis Report', dueDate: '2025-05-22', subject: 'Software Engineering', department: 'Computer Science' },
  { id: 'a3', title: 'AWS EC2 Instance Setup', dueDate: '2025-05-25', subject: 'Cloud Computing', department: 'Computer Science' },
  { id: 'a4', title: 'Analog Circuit Design', dueDate: '2025-05-18', subject: 'Analog Electronics', department: 'EC' }
];

export const QUOTES = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "The expert in anything was once a beginner. - Helen Hayes"
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Mid-term Exams Schedule', message: 'The schedule is now available on the portal.', time: '2h ago', type: 'info', read: false },
  { id: 'n2', title: 'Fee Payment Deadline', message: 'Pay before May 15th to avoid late charges.', time: '5h ago', type: 'urgent', read: false }
];
