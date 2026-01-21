import { useEffect, useMemo, useState } from 'react';
import { exerciseLibrary } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Search, Filter, Dumbbell, RotateCcw, Save, CheckCircle2, Info, Target, Clock, Repeat } from 'lucide-react';


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

  useEffect(() => {
    const raw = localStorage.getItem('exerciseEdits');
    if (raw) setEdits(JSON.parse(raw));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    exerciseLibrary.forEach((e) => set.add(e.category));
    return Array.from(set).sort();
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exerciseLibrary
      .filter((e) => (category === 'all' ? true : e.category === category))
      .filter((e) => (q === '' ? true : e.name.toLowerCase().includes(q) || e.targetMuscles.join(' ').toLowerCase().includes(q)));
  }, [query, category]);

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

  return (
    <div className="max-h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
        <Header />
      <main className="max-w-7xl mx-auto p-1 flex gap-1 flex-1 overflow-hidden">
        {/* Main Content */}
        <section className="flex-1 space-y-1">
          {/* Search and Filters */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-2 mb-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Bibliothèque d'exercices</h2>
                <p className="text-xs text-muted-foreground mt-0">Personnalisez les paramètres par défaut de chaque exercice</p>
              </div>
              <div className="text-sm font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-lg">
                {list.length} exercice{list.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex gap-1">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..." className="pl-8 text-xs h-7" />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-background min-w-[180px] text-foreground"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <br />
            {/* Exercise List */}
            <div className="space-y-3">
                {list.length === 0 ? (
                <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
                    <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Aucun exercice trouvé</h3>
                    <p className="text-sm text-muted-foreground">Essayez d'ajuster vos filtres de recherche</p>
                </div>
                ) : (
                list.map((ex) => {
                    const eEdits = edits[ex.id] || {};
                    const params = { ...ex.defaultParams, ...eEdits };
                    const isExpanded = expandedId === ex.id;
                    const hasChanges = Object.keys(eEdits).length > 0;

                    return (
                    <div key={ex.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-all hover:shadow-md">
                        {/* Exercise Header */}
                        <div 
                        className="p-5 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                        >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-400 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                {ex.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">{ex.name}</h3>
                                {hasChanges && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                    Modifié
                                    </span>
                                )}
                                </div>
                                
                                <div className="flex items-center gap-3 flex-wrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ex.category)}`}>
                                    {ex.category}
                                </span>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Target className="w-4 h-4" />
                                    <span>{ex.targetMuscles.join(', ')}</span>
                                </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{params.duration} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Repeat className="w-4 h-4" />
                                    <span>{params.sets} × {params.reps}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Tempo:</span> {params.tempo}
                                </div>
                                </div>
                            </div>
                            </div>

                            <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            </button>
                        </div>
                        </div>

                        {/* Expanded Parameters */}
                        {isExpanded && (
                        <div className="border-t border-border bg-background p-5">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Paramètres de l'exercice
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {/* Duration */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Durée (min)</label>
                                <Input type="number" value={params.duration ?? ''} onChange={(e) => handleChangeParam(ex.id, 'duration', e.target.value)} />
                            </div>

                            {/* Sets */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Séries</label>
                                <Input type="number" value={params.sets ?? ''} onChange={(e) => handleChangeParam(ex.id, 'sets', e.target.value)} />
                            </div>

                            {/* Reps */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Répétitions</label>
                                <Input type="number" value={params.reps ?? ''} onChange={(e) => handleChangeParam(ex.id, 'reps', e.target.value)} />
                            </div>

                            {/* Tempo */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tempo</label>
                                <Input type="text" value={params.tempo ?? ''} onChange={(e) => handleChangeParam(ex.id, 'tempo', e.target.value)} placeholder="Ex: 3-2-3" />
                            </div>

                            {/* ROM Min */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">ROM min (°)</label>
                                <Input type="number" value={params.romMin ?? ''} onChange={(e) => handleChangeParam(ex.id, 'romMin', e.target.value)} />
                            </div>

                            {/* ROM Max */}
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">ROM max (°)</label>
                                <Input type="number" value={params.romMax ?? ''} onChange={(e) => handleChangeParam(ex.id, 'romMax', e.target.value)} />
                            </div>

                            {/* Pain Threshold */}
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Seuil de douleur (0-10)</label>
                                <Input type="number" min="0" max="10" value={params.painThreshold ?? ''} onChange={(e) => handleChangeParam(ex.id, 'painThreshold', e.target.value)} />
                            </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                            <Button variant="ghost" onClick={() => handleReset(ex.id)} disabled={!hasChanges} className="flex items-center gap-2 disabled:opacity-50">
                                <RotateCcw className="w-4 h-4" />
                                Réinitialiser
                            </Button>

                            <Button onClick={() => handleSave(ex.id, ex.name)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Save className="w-4 h-4" />
                                Enregistrer
                            </Button>
                            </div>
                        </div>
                        )}
                    </div>
                    );
                })
                )}
            </div>
          </div>    
        </section>

        {/* Sidebar */}
        <aside className="w-80 hidden lg:block">
            <div className="sticky top-24 space-y-3">
                
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="font-semibold mb-2 text-emerald-900">Statistiques</h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                        <span className="text-emerald-700">Total exercices</span>
                        <span className="font-semibold">{exerciseLibrary.length}</span>
                        </div>

                        <div className="flex justify-between">
                        <span className="text-emerald-700">Modifiés</span>
                        <span className="font-semibold">{Object.keys(edits).length}</span>
                        </div>

                        <div className="flex justify-between">
                        <span className="text-emerald-700">Catégories</span>
                        <span className="font-semibold">{categories.length}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-xl shadow-sm border border-border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">Guide d'utilisation</h3>
                    </div>

                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div>
                        <h4 className="font-medium text-foreground mb-1">Recherche et filtres</h4>
                        <p>Utilisez la barre de recherche pour trouver un exercice par nom ou groupe musculaire ciblé.</p>
                        </div>

                        <div>
                        <h4 className="font-medium text-foreground mb-1">Modification</h4>
                        <p>Cliquez sur un exercice pour afficher et modifier ses paramètres.</p>
                        </div>

                        <div>
                        <h4 className="font-medium text-foreground mb-1">Paramètres disponibles</h4>
                        <ul className="space-y-1 mt-2">
                            <li>• <strong>Durée:</strong> temps total</li>
                            <li>• <strong>Séries:</strong> nombre de séries</li>
                            <li>• <strong>Répétitions:</strong> reps</li>
                            <li>• <strong>Tempo:</strong> rythme</li>
                            <li>• <strong>ROM:</strong> amplitude</li>
                            <li>• <strong>Seuil:</strong> douleur</li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
      </main>

      {/* Save Notification */}
      {savedNotification && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{savedNotification} sauvegardé!</span>
        </div>
      )}
    </div>
  );
}