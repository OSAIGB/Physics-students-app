
export interface Question {
  q: string;
  a: string[];
  c: number;
  topics?: string[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  status: 'auth' | 'locked' | 'quiz' | 'submitting' | 'finished';
  userName: string;
  userEmail: string;
  startTime: number | null;
  endTime: number | null;
  score: number | null;
}

export interface SubmissionRecord {
  name: string;
  email: string;
  score: number;
  totalQuestions: number;
  ip: string;
  percentage?: number;
  timestamp: any; // Firestore Timestamp
}
