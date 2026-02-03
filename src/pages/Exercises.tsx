import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Search, Filter, Dumbbell, RotateCcw, Save, CheckCircle2, Info, Target, Clock, Repeat } from 'lucide-react';
import exerciseService from '@/lib/exerciseService';
import ExerciseEditor from '@/components/ExerciseEditor';
import { Exercise } from '@/types';
import { exerciseLibrary as defaultLibrary } from '@/data/mockData';

type EditableParams = {
  duration?: number;
  sets?: number;
  reps?: number;
  tempo?: string;
  romMin?: number;
  romMax?: number;
  painThreshold?: number;
};

export default function Exercises() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [edits, setEdits] = useState<Record<string, EditableParams>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>(() => exerciseService.loadExercises() || defaultLibrary);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('exerciseEdits');
    if (raw) setEdits(JSON.parse(raw));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach((e) => set.add(e.category));
    return Array.from(set).sort();
  }, [exercises]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises
      .filter((e) => (category === 'all' ? true : e.category === category))
      .filter((e) => (q === '' ? true : e.name.toLowerCase().includes(q) || e.targetMuscles.join(' ').toLowerCase().includes(q)));
  }, [query, category, exercises]);

  const handleChangeParam = (id: string, key: keyof EditableParams, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: key === 'tempo' ? value : value === '' ? undefined : Number(value),
      },
    }));
  };

  const handleSave = (id: string, name: string) => {
    localStorage.setItem('exerciseEdits', JSON.stringify(edits));
    setSavedNotification(name);
    setTimeout(() => setSavedNotification(null), 2000);
  };

  const handleReset = (id: string) => {
    setEdits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      localStorage.setItem('exerciseEdits', JSON.stringify(copy));
      return copy;
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Strengthening': 'bg-purple-100 text-purple-700',
      'ROM': 'bg-blue-100 text-blue-700',
      'Circulation': 'bg-emerald-100 text-emerald-700',
      'Balance': 'bg-orange-100 text-orange-700',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  const onEditorSave = (payload: any) => {
    if (payload.id) {
      const updated = exerciseService.updateExercise(payload.id, payload);
      if (updated) setExercises((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const added = exerciseService.addExercise(payload);
      setExercises((prev) => [added, ...prev]);
    }
  };

  const onEditorDelete = (id: string) => {
    exerciseService.deleteExercise(id);
    setExercises((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto p-6 flex gap-6">
          <section className="flex-1 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Bibliothèque d'exercices</h2>
                <p className="text-sm text-muted-foreground mt-1">Personnalisez les paramètres par défaut de chaque exercice</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">{list.length} exercice{list.length !== 1 ? 's' : ''}</div>
                <Button onClick={() => { setEditing(null); setEditorOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                  <span>+</span> Ajouter exercice
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par nom ou groupe musculaire..." className="pl-10 text-sm h-10 rounded-lg" />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-background text-foreground font-medium min-w-[200px] shadow-sm hover:border-emerald-300 transition-colors"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 mt-6">
              {list.length === 0 ? (
                <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-16 text-center">
                  <Dumbbell className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun exercice trouvé</h3>
                  <p className="text-sm text-slate-600">Essayez d'ajuster vos filtres de recherche</p>
                </div>
              ) : (
                list.map((ex) => {
                  const eEdits = edits[ex.id] || {};
                  const params = { ...ex.defaultParams, ...eEdits };
                  const isExpanded = expandedId === ex.id;
                  const hasChanges = Object.keys(eEdits).length > 0;

                  return (
                    <Card key={ex.id} className="transition-all duration-200 hover:shadow-lg hover:border-emerald-200 cursor-pointer overflow-hidden">
                      <div className="p-5" onClick={() => setExpandedId(isExpanded ? null : ex.id)}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-500 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 shadow-md">
                              {ex.icon}
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="min-w-0">
                                  <h3 className="text-xl font-bold text-slate-900">{ex.name}</h3>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(ex.category)}`}>{ex.category}</span>
                                    {ex.targetMuscles.length > 0 && (
                                      <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <Target className="w-4 h-4" />
                                        <span>{ex.targetMuscles.join(', ')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {hasChanges && (
                                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">Modifié</span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Clock className="w-4 h-4 text-emerald-600" />
                                  <span className="font-medium">{params.duration} min</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Repeat className="w-4 h-4 text-emerald-600" />
                                  <span className="font-medium">{params.sets}×{params.reps}</span>
                                </div>
                                <div className="text-slate-600">
                                  <span className="font-medium">Tempo: {params.tempo}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <button className="text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors" onClick={(ev) => { ev.stopPropagation(); setEditing(ex); setEditorOpen(true); }} title="Modifier">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide"><Filter className="w-4 h-4 text-emerald-600" />Paramètres par défaut</h4>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-tight">Durée (min)</label>
                              <Input type="number" value={params.duration ?? ''} onChange={(e) => handleChangeParam(ex.id, 'duration', e.target.value)} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-tight">Séries</label>
                              <Input type="number" value={params.sets ?? ''} onChange={(e) => handleChangeParam(ex.id, 'sets', e.target.value)} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-tight">Répétitions</label>
                              <Input type="number" value={params.reps ?? ''} onChange={(e) => handleChangeParam(ex.id, 'reps', e.target.value)} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-tight">Tempo</label>
                              <Input type="text" value={params.tempo ?? ''} onChange={(e) => handleChangeParam(ex.id, 'tempo', e.target.value)} placeholder="Ex: 3-2-3" className="h-9 text-sm" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight">ROM min (°)</label>
                              <Input type="number" value={params.romMin ?? ''} onChange={(e) => handleChangeParam(ex.id, 'romMin', e.target.value)} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight">ROM max (°)</label>
                              <Input type="number" value={params.romMax ?? ''} onChange={(e) => handleChangeParam(ex.id, 'romMax', e.target.value)} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight">Seuil douleur (0-10)</label>
                              <Input type="number" min="0" max="10" value={params.painThreshold ?? ''} onChange={(e) => handleChangeParam(ex.id, 'painThreshold', e.target.value)} className="h-9 text-sm" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
                            <Button variant="ghost" onClick={() => handleReset(ex.id)} disabled={!hasChanges} className="flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                              <RotateCcw className="w-4 h-4" />
                              Réinitialiser
                            </Button>

                            <Button onClick={() => handleSave(ex.id, ex.name)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all gap-2">
                              <Save className="w-4 h-4" />
                              Enregistrer
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <aside className="w-80 hidden lg:block">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-emerald-900">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/50 rounded-lg p-3 border border-emerald-100">
                  <span className="text-emerald-700 font-medium">Total exercices</span>
                  <span className="font-bold text-emerald-900 text-lg">{exercises.length}</span>
                </div>
                <div className="flex justify-between items-center bg-white/50 rounded-lg p-3 border border-emerald-100">
                  <span className="text-emerald-700 font-medium">Modifiés</span>
                  <span className="font-bold text-emerald-900 text-lg">{Object.keys(edits).length}</span>
                </div>
                <div className="flex justify-between items-center bg-white/50 rounded-lg p-3 border border-emerald-100">
                  <span className="text-emerald-700 font-medium">Catégories</span>
                  <span className="font-bold text-emerald-900 text-lg">{categories.length}</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-blue-500" /><h3 className="font-bold text-foreground">Guide d'utilisation</h3></div>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div><h4 className="font-semibold text-foreground mb-1.5">🔍 Recherche et filtres</h4><p className="text-xs leading-relaxed">Utilisez la barre de recherche pour trouver un exercice par nom ou groupe musculaire ciblé.</p></div>
                <div className="border-t border-border pt-3"><h4 className="font-semibold text-foreground mb-1.5">✏️ Modification</h4><p className="text-xs leading-relaxed">Cliquez sur un exercice pour afficher et modifier ses paramètres.</p></div>
                <div className="border-t border-border pt-3"><h4 className="font-semibold text-foreground mb-2">⚙️ Paramètres</h4><ul className="space-y-1 text-xs"><li>• <strong>Durée:</strong> temps total</li><li>• <strong>Séries:</strong> nombre de séries</li><li>• <strong>Répétitions:</strong> reps</li><li>• <strong>Tempo:</strong> rythme</li><li>• <strong>ROM:</strong> amplitude</li><li>• <strong>Seuil:</strong> douleur</li></ul></div>
              </div>
            </div>
          </div>
        </aside>
      </main>
      </div>

      {savedNotification && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300 border border-emerald-400/30">
          <div className="bg-white/20 p-1.5 rounded-full">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold block">{savedNotification}</span>
            <span className="text-xs opacity-90">Modifications sauvegardées</span>
          </div>
        </div>
      )}

      <ExerciseEditor open={editorOpen} onOpenChange={setEditorOpen} initial={editing} onSave={(p) => onEditorSave(p)} onDelete={(id) => onEditorDelete(id)} />
    </div>
  );
}