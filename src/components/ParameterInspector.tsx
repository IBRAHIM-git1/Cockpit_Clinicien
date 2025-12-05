import { ScheduledExercise, ExerciseParams } from '@/types';
import { X, Clock, RotateCcw, Gauge, Activity, AlertTriangle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ParameterInspectorProps {
  scheduledExercise: ScheduledExercise;
  onUpdate: (params: ExerciseParams) => void;
  onClose: () => void;
  onRemove: () => void;
}

export function ParameterInspector({
  scheduledExercise,
  onUpdate,
  onClose,
  onRemove,
}: ParameterInspectorProps) {
  const { exercise, params } = scheduledExercise;

  const updateParam = <K extends keyof ExerciseParams>(key: K, value: ExerciseParams[K]) => {
    onUpdate({ ...params, [key]: value });
  };

  return (
    <div className="animate-slide-up bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{exercise.icon}</span>
          <div>
            <h3 className="font-semibold text-foreground">{exercise.name}</h3>
            <p className="text-xs text-muted-foreground">{exercise.category}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Durée
          </Label>
          <span className="text-sm font-medium text-foreground">{params.duration} min</span>
        </div>
        <Slider
          value={[params.duration]}
          onValueChange={([v]) => updateParam('duration', v)}
          min={5}
          max={30}
          step={1}
          className="w-full"
        />
      </div>

      {/* Sets & Reps */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Séries
          </Label>
          <Input
            type="number"
            value={params.sets}
            onChange={(e) => updateParam('sets', parseInt(e.target.value) || 1)}
            min={1}
            max={10}
            className="h-9 bg-secondary"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Répétitions</Label>
          <Input
            type="number"
            value={params.reps}
            onChange={(e) => updateParam('reps', parseInt(e.target.value) || 1)}
            min={1}
            max={30}
            className="h-9 bg-secondary"
          />
        </div>
      </div>

      {/* Tempo */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5" />
          Tempo
        </Label>
        <Input
          value={params.tempo}
          onChange={(e) => updateParam('tempo', e.target.value)}
          placeholder="p. ex., 3-2-3"
          className="h-9 bg-secondary font-mono"
        />
      </div>

      {/* ROM Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Amplitude de Mouvement
          </Label>
          <span className="text-sm font-medium text-foreground">
            {params.romMin}° - {params.romMax}°
          </span>
        </div>
        <div className="relative h-16 flex items-center justify-center">
          {/* Visual ROM Cone */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 50 50 L 50 10 A 40 40 0 0 1 90 50 Z"
                fill="hsl(var(--muted))"
                opacity="0.3"
              />
              {/* Active ROM arc */}
              <path
                d={`M 50 50 L ${50 + 40 * Math.sin((params.romMin * Math.PI) / 180)} ${
                  50 - 40 * Math.cos((params.romMin * Math.PI) / 180)
                } A 40 40 0 0 1 ${50 + 40 * Math.sin((params.romMax * Math.PI) / 180)} ${
                  50 - 40 * Math.cos((params.romMax * Math.PI) / 180)
                } Z`}
                fill="hsl(var(--primary))"
                opacity="0.5"
              />
              {/* Center point */}
              <circle cx="50" cy="50" r="4" fill="hsl(var(--primary))" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Min</Label>
            <Input
              type="number"
              value={params.romMin}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                if (val < params.romMax) {
                  updateParam('romMin', val);
                }
              }}
              min={0}
              max={params.romMax - 5}
              step={5}
              className="h-9 bg-secondary"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Max</Label>
            <Input
              type="number"
              value={params.romMax}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 180;
                if (val > params.romMin) {
                  updateParam('romMax', val);
                }
              }}
              min={params.romMin + 5}
              max={180}
              step={5}
              className="h-9 bg-secondary"
            />
          </div>
        </div>
      </div>

      {/* Pain Threshold */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            Seuil de Douleur Sûr
          </Label>
          <span className={`text-sm font-medium ${params.painThreshold > 5 ? 'text-warning' : 'text-success'}`}>
            {params.painThreshold}/10
          </span>
        </div>
        <Slider
          value={[params.painThreshold]}
          onValueChange={([v]) => updateParam('painThreshold', v)}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        {params.painThreshold > 5 && (
          <p className="text-xs text-warning">
            ⚠ Un seuil de douleur plus élevé peut augmenter l'inconfort
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button variant="outline" className="flex-1" onClick={onRemove}>
          Supprimer
        </Button>
        <Button className="flex-1" onClick={onClose}>
          Terminé
        </Button>
      </div>
    </div>
  );
}
