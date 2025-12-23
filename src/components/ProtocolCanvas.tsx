import { useState, useCallback } from 'react';
import { Exercise, ScheduledExercise, ExerciseParams } from '@/types';
import { daysOfWeek, exerciseLibrary } from '@/data/mockData';
import { ExerciseLibraryDrawer } from './ExerciseLibraryDrawer';
import { ParameterInspector } from './ParameterInspector';
import { Calendar, BookOpen, ChevronDown, ChevronUp, Save, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProtocolCanvasProps {
  postOpDay: number;
  onPublish: (exercises: ScheduledExercise[]) => void;
}

export function ProtocolCanvas({ postOpDay, onPublish }: ProtocolCanvasProps) {
  const [scheduledExercises, setScheduledExercises] = useState<ScheduledExercise[]>([]);
  const [draggingExercise, setDraggingExercise] = useState<Exercise | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ScheduledExercise | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const handleDragStart = useCallback((exercise: Exercise) => {
    setDraggingExercise(exercise);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDragOverDay(day);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDay(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDragOverDay(null);

    const exerciseData = e.dataTransfer.getData('exercise');
    if (exerciseData) {
      const exercise: Exercise = JSON.parse(exerciseData);
      const newScheduledExercise: ScheduledExercise = {
        id: `${exercise.id}-${day}-${Date.now()}`,
        exercise,
        params: { ...exercise.defaultParams },
        day,
        order: scheduledExercises.filter((se) => se.day === day).length,
      };
      setScheduledExercises((prev) => [...prev, newScheduledExercise]);
    }

    setDraggingExercise(null);
  }, [scheduledExercises]);

  const handleUpdateParams = useCallback((id: string, params: ExerciseParams) => {
    setScheduledExercises((prev) =>
      prev.map((se) => (se.id === id ? { ...se, params } : se))
    );
    if (selectedExercise?.id === id) {
      setSelectedExercise((prev) => prev ? { ...prev, params } : null);
    }
  }, [selectedExercise]);

  const handleRemoveExercise = useCallback((id: string) => {
    setScheduledExercises((prev) => prev.filter((se) => se.id !== id));
    setSelectedExercise(null);
  }, []);

  const getExercisesForDay = (day: number) =>
    scheduledExercises.filter((se) => se.day === day);

  return (
    <div className="h-full flex flex-col panel overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Canevas du Protocole
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Phase 2 • Semaine 3</span>
          {/* <span className="text-xs text-muted-foreground">QUOI</span> */}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Exercise Library Sidebar */}
        <div
          className={`border-r border-border transition-all duration-300 ${
            isLibraryOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <div className="w-64 h-full flex flex-col">
            <div className="p-2 border-b border-border flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Bibliothèque d'Exercices
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsLibraryOpen(false)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <ExerciseLibraryDrawer
              exercises={exerciseLibrary}
              onDragStart={handleDragStart}
              postOpDay={postOpDay}
            />
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Library Toggle (when closed) */}
          {!isLibraryOpen && (
            <Button
              variant="outline"
              size="sm"
              className="m-2 self-start"
              onClick={() => setIsLibraryOpen(true)}
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              Bibliothèque
              <ChevronUp className="w-4 h-4 ml-1.5" />
            </Button>
          )}

          {/* Weekly Timeline */}
          <div className="flex-1 overflow-x-auto scrollbar-thin p-4">
            <div className="grid grid-cols-7 gap-3 min-w-[900px]">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="flex flex-col">
                  {/* Day Header */}
                  <div className="text-center mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{day}</span>
                    {index < 5 && (
                      <Badge variant="secondary" className="ml-1.5 text-[10px]">
                        Actif
                      </Badge>
                    )}
                  </div>

                  {/* Drop Zone */}
                  <div
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`timeline-slot flex-1 p-2 space-y-2 ${
                      dragOverDay === index ? 'timeline-slot-active' : ''
                    }`}
                  >
                    {getExercisesForDay(index).map((se) => (
                      <div
                        key={se.id}
                        onClick={() => setSelectedExercise(se)}
                        className={`exercise-block ${
                          selectedExercise?.id === se.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{se.exercise.icon}</span>
                          <span className="text-xs font-medium text-foreground truncate">
                            {se.exercise.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">
                            {se.params.sets}×{se.params.reps}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {se.params.duration}min
                          </span>
                        </div>
                      </div>
                    ))}
                    {getExercisesForDay(index).length === 0 && (
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        Déposer ici
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parameter Inspector (when exercise selected) */}
          {selectedExercise && (
            <div className="border-t border-border p-4">
              <ParameterInspector
                scheduledExercise={selectedExercise}
                onUpdate={(params) => handleUpdateParams(selectedExercise.id, params)}
                onClose={() => setSelectedExercise(null)}
                onRemove={() => handleRemoveExercise(selectedExercise.id)}
              />
            </div>
          )}

          {/* Actions Bar */}
          <div className="border-t border-border p-3 flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {scheduledExercises.length} exercices planifiés
              </span>
              {scheduledExercises.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setScheduledExercises([])}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Tout Effacer
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Enregistrer le Brouillon
              </Button>
              <Button
                size="sm"
                onClick={() => onPublish(scheduledExercises)}
                disabled={scheduledExercises.length === 0}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Publier le Protocole
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
