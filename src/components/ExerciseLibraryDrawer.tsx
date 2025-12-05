import { useState } from 'react';
import { Exercise } from '@/types';
import { Search, Filter, GripVertical, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ExerciseLibraryDrawerProps {
  exercises: Exercise[];
  onDragStart: (exercise: Exercise) => void;
  postOpDay: number;
}

export function ExerciseLibraryDrawer({ exercises, onDragStart, postOpDay }: ExerciseLibraryDrawerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(exercises.map((e) => e.category))];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase()) ||
      exercise.targetMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isContraindicated = (exercise: Exercise) => {
    return exercise.contraindications.some((c) => {
      const match = c.match(/post-op < (\d+) weeks/);
      if (match) {
        const weeks = parseInt(match[1]);
        return postOpDay < weeks * 7;
      }
      return false;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des exercices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border text-sm"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        {filteredExercises.map((exercise) => {
          const contraindicated = isContraindicated(exercise);
          
          return (
            <div
              key={exercise.id}
              draggable={!contraindicated}
              onDragStart={(e) => {
                if (!contraindicated) {
                  e.dataTransfer.setData('exercise', JSON.stringify(exercise));
                  onDragStart(exercise);
                }
              }}
              className={`exercise-block flex flex-col gap-2 ${
                contraindicated ? 'opacity-50 cursor-not-allowed' : 'drag-handle'
              }`}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-lg flex-shrink-0">{exercise.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {exercise.name}
                    </p>
                    {contraindicated && (
                      <AlertCircle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {exercise.targetMuscles.join(', ')}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] w-fit">
                {exercise.category}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
