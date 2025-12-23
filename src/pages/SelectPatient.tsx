import { patients } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';



import { Search, Filter, Users, Clock, AlertCircle, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

export default function SelectPatient() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [postOpFilter, setPostOpFilter] = useState('all');
  const [previewId, setPreviewId] = useState(patients[0]?.id ?? null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    try {
      localStorage.setItem('selectedPatientId', id);
    } catch (e) {
      console.warn('Could not persist selectedPatientId', e);
    }
    navigate('/');
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      if (q) {
        const matches = p.name.toLowerCase().includes(q) || p.injuryType.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (postOpFilter === '0-7' && !(p.postOpDay <= 7)) return false;
      if (postOpFilter === '8-21' && !(p.postOpDay >= 8 && p.postOpDay <= 21)) return false;
      if (postOpFilter === '22+' && !(p.postOpDay >= 22)) return false;
      return true;
    });
  }, [query, statusFilter, postOpFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-emerald-600 bg-emerald-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-track': return <CheckCircle2 className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'on-track': return 'Sur la bonne voie';
      case 'warning': return 'Attention';
      case 'critical': return 'Critique';
      default: return status;
    }
  };

  const previewPatient = patients.find((x) => x.id === previewId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
        <Header />

      <main className="flex-1 flex gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left Panel - Patient List */}
        <section className="flex-1 space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Choisir un patient</h2>
              <p className="text-sm text-muted-foreground">Sélectionnez un patient pour charger son tableau de bord et son protocole.</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="space-y-3 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher par nom ou type de blessure..."
                    className="pl-10"
                  />
                </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filtres</span>
                </button>

                {(statusFilter !== 'all' || postOpFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setPostOpFilter('all');
                    }}
                    className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2"
                  >
                    Réinitialiser
                  </button>
                )}

                <div className="ml-auto text-sm text-muted-foreground">
                  {filtered.length} patient{filtered.length !== 1 ? 's' : ''}
                </div>
              </div>

              {showFilters && (
                <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Statut</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                    >
                      <option value="all">Tous statuts</option>
                      <option value="on-track">Sur la bonne voie</option>
                      <option value="warning">Attention</option>
                      <option value="critical">Critique</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Post-opératoire</label>
                    <select
                      value={postOpFilter}
                      onChange={(e) => setPostOpFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                    >
                      <option value="all">Tous les jours</option>
                      <option value="0-7">0-7 jours</option>
                      <option value="8-21">8-21 jours</option>
                      <option value="22+">22+ jours</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Patient List */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Aucun patient trouvé</p>
                  <p className="text-sm text-muted-foreground mt-1">Essayez d'ajuster vos filtres</p>
                </div>
              ) : (
                filtered.map((p) => (
                  <Card
                    key={p.id}
                    onClick={() => setPreviewId(p.id)}
                    className={`p-4 transition-all cursor-pointer ${previewId === p.id ? 'border-emerald-500 bg-emerald-50/60' : 'border-transparent bg-card hover:shadow-sm'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 truncate">{p.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2 truncate">
                            <span className="truncate">{p.injuryType}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {p.postOpDay} jours post-op
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                              {getStatusIcon(p.status)}
                              {getStatusLabel(p.status)}
                            </span>
                            {p.adherenceScore && (
                              <span className="text-xs text-muted-foreground">
                                Adhésion: <span className="font-semibold text-foreground">{p.adherenceScore}%</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-colors ${previewId === p.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Panel - Preview */}
        <aside className="w-80 hidden lg:block">
          <div className="bg-card rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Aperçu du patient
            </h3>

            {previewPatient ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {previewPatient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">{previewPatient.name}</div>
                    <div className="text-sm text-muted-foreground">{previewPatient.age} ans</div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Blessure</span>
                    <span className="font-medium text-slate-900">{previewPatient.injuryType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Post-op</span>
                    <span className="font-medium text-slate-900">{previewPatient.postOpDay} jours</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-600">Statut</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(previewPatient.status)}`}>
                      {getStatusIcon(previewPatient.status)}
                      {getStatusLabel(previewPatient.status)}
                    </span>
                  </div>
                  {previewPatient.adherenceScore && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Adhésion</span>
                      <span className="font-medium text-slate-900">{previewPatient.adherenceScore}%</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={() => handleSelect(previewPatient.id)}>
                  Sélectionner ce patient
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600">Aucun patient sélectionné</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-emerald-900 mb-1">Aide</h4>
                  <p className="text-xs text-emerald-700">
                    Utilisez la recherche et les filtres pour trouver rapidement un patient. Cliquez sur un patient pour voir l'aperçu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="bg-card border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Clinique Exemple — Cockpit du Clinicien • © 2025
        </p>
      </footer>
    </div>
  );
}