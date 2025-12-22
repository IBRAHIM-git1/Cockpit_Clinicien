import { Patient, Exercise, EvidenceResult, Doctor } from '@/types';
import data from './data.json';

export const mockPatient: Patient = data.mockPatient as Patient;
export const exerciseLibrary: Exercise[] = data.exerciseLibrary as Exercise[];
export const mockEvidenceResults: EvidenceResult[] = data.mockEvidenceResults as EvidenceResult[];
export const daysOfWeek: string[] = data.daysOfWeek as string[];
export const doctor: Doctor = data.mockDoctor as Doctor;

