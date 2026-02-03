import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Exercise } from '@/types';
import { ArrowRight } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Exercise | null;
  onSave: (payload: Omit<Exercise, 'id'> | Exercise) => void;
  onDelete?: (id: string) => void;
};

export const ExerciseEditor: React.FC<Props> = ({ open, onOpenChange, initial = null, onSave, onDelete }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('');
  const [targetMuscles, setTargetMuscles] = useState('');
  const [contra, setContra] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [sets, setSets] = useState<number | ''>('');
  const [reps, setReps] = useState<number | ''>('');
  const [tempo, setTempo] = useState('');
  const [romMin, setRomMin] = useState<number | ''>('');
  const [romMax, setRomMax] = useState<number | ''>('');
  const [painThreshold, setPainThreshold] = useState<number | ''>('');

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setCategory(initial.category || '');
      setIcon(initial.icon || '');
      setTargetMuscles((initial.targetMuscles || []).join(', '));
      setContra((initial.contraindications || []).join(', '));
      const p = initial.defaultParams || ({} as any);
      setDuration(p.duration ?? '');
      setSets(p.sets ?? '');
      setReps(p.reps ?? '');
      setTempo(p.tempo ?? '');
      setRomMin(p.romMin ?? '');
      setRomMax(p.romMax ?? '');
      setPainThreshold(p.painThreshold ?? '');
    } else {
      setName('');
      setCategory('');
      setIcon('');
      setTargetMuscles('');
      setContra('');
      setDuration('');
      setSets('');
      setReps('');
      setTempo('');
      setRomMin('');
      setRomMax('');
      setPainThreshold('');
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    const payload: any = {
      name: name.trim(),
      category: category.trim() || 'Uncategorized',
      icon: icon || '🏋️',
      targetMuscles: targetMuscles.split(',').map((s) => s.trim()).filter(Boolean),
      contraindications: contra.split(',').map((s) => s.trim()).filter(Boolean),
      defaultParams: {
        duration: duration === '' ? 0 : Number(duration),
        sets: sets === '' ? 1 : Number(sets),
        reps: reps === '' ? 1 : Number(reps),
        tempo: tempo || 'continuous',
        romMin: romMin === '' ? 0 : Number(romMin),
        romMax: romMax === '' ? 0 : Number(romMax),
        painThreshold: painThreshold === '' ? 0 : Number(painThreshold),
      },
    };

    if (initial && initial.id) {
      onSave({ ...initial, ...payload } as Exercise);
    } else {
      onSave(payload);
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!initial || !initial.id || !onDelete) return;
    onDelete(initial.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{initial ? 'Modifier l\'exercice' : 'Nouvel exercice'}</DialogTitle>
          <DialogDescription className="text-sm">Configurez les détails et paramètres par défaut de l'exercice</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          {/* Exercise Details Section */}
          <div className="space-y-3 pb-4 border-b border-border">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="text-lg">📋</span> Informations générales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nom de l'exercice</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Squat, Développé couché..."
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Catégorie</label>
                <Input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="Ex: Bas du corps, Haut du corps..."
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Icône (emoji)</label>
                <Input 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)} 
                  placeholder="🏋️"
                  className="h-10 text-lg text-center"
                  maxLength={10}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Groupes musculaires</label>
                <Input 
                  value={targetMuscles} 
                  onChange={(e) => setTargetMuscles(e.target.value)} 
                  placeholder="Quadriceps, Ischio-jambiers..."
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Contre-indications</label>
              <Input 
                value={contra} 
                onChange={(e) => setContra(e.target.value)} 
                placeholder="Ex: Fracture, Entorse..."
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Notes / Description</label>
              <Textarea 
                placeholder="Ajoutez des notes supplémentaires (optionnel)" 
                className="resize-none min-h-20 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Parameters Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="text-lg">⚙️</span> Paramètres par défaut
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Durée (min)</label>
                <Input 
                  type="number" 
                  value={duration as any} 
                  onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))} 
                  placeholder="30"
                  className="h-10 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Séries</label>
                <Input 
                  type="number" 
                  value={sets as any} 
                  onChange={(e) => setSets(e.target.value === '' ? '' : Number(e.target.value))} 
                  placeholder="3"
                  className="h-10 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Répétitions</label>
                <Input 
                  type="number" 
                  value={reps as any} 
                  onChange={(e) => setReps(e.target.value === '' ? '' : Number(e.target.value))} 
                  placeholder="10"
                  className="h-10 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tempo</label>
                <Input 
                  value={tempo} 
                  onChange={(e) => setTempo(e.target.value)} 
                  placeholder="3-2-3"
                  className="h-10 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-blue-50 rounded-lg border border-blue-150">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">ROM min (°)</label>
                <Input 
                  type="number" 
                  value={romMin as any} 
                  onChange={(e) => setRomMin(e.target.value === '' ? '' : Number(e.target.value))} 
                  placeholder="0"
                  className="h-10 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">ROM max (°)</label>
                <Input 
                  type="number" 
                  value={romMax as any} 
                  onChange={(e) => setRomMax(e.target.value === '' ? '' : Number(e.target.value))} 
                  placeholder="90"
                  className="h-10 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Seuil douleur (0-10)</label>
                <Input 
                  type="number" 
                  value={painThreshold as any} 
                  onChange={(e) => setPainThreshold(e.target.value === '' ? '' : Number(e.target.value))} 
                  placeholder="0"
                  min="0"
                  max="10"
                  className="h-10 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t border-border mt-6">
          {initial && onDelete && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              Supprimer
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all gap-2"
            >
              {initial ? 'Enregistrer' : 'Ajouter exercice'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseEditor;
