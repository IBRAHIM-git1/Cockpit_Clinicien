import { Exercise } from '@/types';
import data from '@/data/data.json';

const STORAGE_KEY = 'exerciseLibrary';

const defaultLibrary: Exercise[] = (data as any).exerciseLibrary || [];

export function loadExercises(): Exercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Exercise[];
  } catch (e) {
    console.warn('Failed to parse exercises from storage', e);
  }
  return defaultLibrary;
}

export function saveExercises(list: Exercise[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addExercise(ex: Omit<Exercise, 'id'>) {
  const list = loadExercises();
  const id = generateId();
  const newEx: Exercise = { ...ex, id };
  list.unshift(newEx);
  saveExercises(list);
  return newEx;
}

export function updateExercise(id: string, patch: Partial<Exercise>) {
  const list = loadExercises();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...patch } as Exercise;
  list[idx] = updated;
  saveExercises(list);
  return updated;
}

export function deleteExercise(id: string) {
  const list = loadExercises();
  const next = list.filter((e) => e.id !== id);
  saveExercises(next);
}

function generateId() {
  return 'ex_' + Math.random().toString(36).slice(2, 9);
}

export default { loadExercises, saveExercises, addExercise, updateExercise, deleteExercise };
