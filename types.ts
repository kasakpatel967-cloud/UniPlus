
export type CampusEventCategory = 'Technical' | 'Cultural' | 'Academic' | 'Club' | 'Sports';

export interface AttendanceRecord {
  name: string;
  attended: number;
  total: number;
  missedDates?: string[];
}

export interface Attendance {
  academic: {
    attended: number;
    total: number;
    subjects: AttendanceRecord[];
  };
  events: {
    attended: number;
    total: number;
    missedEventTitles: string[];
  };
}

export interface User {
  studentId: string;
  name: string;
  department: 'EC' | 'EL' | 'IT' | 'Mech' | 'Computer Science';
  batch: string;
  year: string;
  email: string;
  phone: string;
  photo?: string;
  registeredEventIds?: string[];
  joinedClubIds?: string[];
  attendance?: Attendance;
}

export interface SharedNote {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video';
  sender: string;
  timestamp: string;
  size: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: CampusEventCategory;
  imageUrl: string;
  registrationLink: string;
}

export interface TimetableSlot {
  id: string;
  subject: string;
  faculty: string;
  startTime: string;
  endTime: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
}

export interface Department {
  id: string;
  name: string;
  slots: TimetableSlot[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'reminder' | 'urgent';
  read: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  description: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  subject: string;
  department: string;
}

export interface Club {
  id: string;
  name: string;
  type: 'Compulsory' | 'Chapter';
  description: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  isPrivate: boolean;
  notes?: SharedNote[];
}

export type View = 'Dashboard' | 'Events' | 'Timetable' | 'Assistant' | 'Clubs' | 'Scholarships' | 'StudyGroup' | 'Assignments' | 'Profile' | 'History';
