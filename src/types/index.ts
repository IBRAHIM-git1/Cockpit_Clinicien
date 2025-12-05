export interface Patient {
  id: string;
  name: string;
  age: number;
  injuryType: string;
  postOpDay: number;
  status: 'on-track' | 'warning' | 'critical';
  statusLabel: string;
  romData: number[];
  adherenceScore: number;
  painLevels: number[];
  intensityLevels: number[];
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscles: string[];
  contraindications: string[];
  icon: string;
  defaultParams: ExerciseParams;
}

export interface ExerciseParams {
  duration: number;
  sets: number;
  reps: number;
  tempo: string;
  romMin: number;
  romMax: number;
  painThreshold: number;
}

export interface ScheduledExercise {
  id: string;
  exercise: Exercise;
  params: ExerciseParams;
  day: number;
  order: number;
}

export interface Protocol {
  id: string;
  patientId: string;
  name: string;
  phase: number;
  weekStart: Date;
  exercises: ScheduledExercise[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'suggestion' | 'warning' | 'info';
}

export interface EvidenceResult {
  id: string;
  title: string;
  source: string;
  type: 'guideline' | 'paper' | 'protocol';
  relevance: number;
  summary: string;
}
