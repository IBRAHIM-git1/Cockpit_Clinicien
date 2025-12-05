import { Patient } from '@/types';
import { Activity, TrendingUp, Heart, AlertTriangle, User } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface PatientContextPanelProps {
  patient: Patient;
}

export function PatientContextPanel({ patient }: PatientContextPanelProps) {
  const romChartData = patient.romData.map((value, index) => ({
    day: index + 1,
    rom: value,
  }));

  const painIntensityData = patient.painLevels.map((pain, index) => ({
    day: index + 1,
    pain,
    intensity: patient.intensityLevels[index],
  }));

  const getStatusClass = () => {
    switch (patient.status) {
      case 'on-track':
        return 'status-on-track';
      case 'warning':
        return 'status-warning';
      case 'critical':
        return 'status-critical';
    }
  };

  const getStatusIcon = () => {
    switch (patient.status) {
      case 'on-track':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'critical':
        return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="h-full flex flex-col panel overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Contexte du Patient
        </h2>
        <span className="text-xs text-muted-foreground">QUI</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Patient Card */}
        <div className="metric-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} ans • Jour {patient.postOpDay} Post-Op
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Blessure:</span>
            <span className="text-sm font-medium text-foreground">{patient.injuryType}</span>
          </div>
          <div className={`status-badge ${getStatusClass()}`}>
            {getStatusIcon()}
            {patient.statusLabel}
          </div>
        </div>

        {/* ROM Trend */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-chart-1" />
              Tendance ROM (7 jours)
            </span>
            <span className="text-sm font-semibold text-chart-1">
              {patient.romData[patient.romData.length - 1]}°
            </span>
          </div>
          <div className="h-[80px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={romChartData}>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[0, 120]} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(222 47% 10%)',
                    border: '1px solid hsl(222 30% 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(210 40% 96%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="rom"
                  stroke="hsl(174 72% 56%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(174 72% 56%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Jour 1</span>
            <span>Jour 7</span>
          </div>
        </div>

        {/* Adherence Score */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-chart-3" />
              Indice d'Adhésion
            </span>
            <span className={`text-sm font-semibold ${patient.adherenceScore >= 80 ? 'text-success' : patient.adherenceScore >= 60 ? 'text-warning' : 'text-destructive'}`}>
              {patient.adherenceScore}%
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                patient.adherenceScore >= 80
                  ? 'bg-success'
                  : patient.adherenceScore >= 60
                  ? 'bg-warning'
                  : 'bg-destructive'
              }`}
              style={{ width: `${patient.adherenceScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Objectif: 85%</span>
            <span className="text-warning">⚠ Sous l'objectif</span>
          </div>
        </div>

        {/* Pain vs Intensity */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-chart-4" />
              Douleur vs Intensité
            </span>
          </div>
          <div className="h-[80px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={painIntensityData}>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(222 47% 10%)',
                    border: '1px solid hsl(222 30% 16%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(210 40% 96%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="pain"
                  stroke="hsl(0 72% 51%)"
                  strokeWidth={2}
                  dot={false}
                  name="Douleur"
                />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="hsl(199 89% 48%)"
                  strokeWidth={2}
                  dot={false}
                  name="Intensité"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Douleur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-chart-2" />
              <span className="text-xs text-muted-foreground">Intensité</span>
            </div>
          </div>
        </div>

        {/* Aperçus Rapides */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Aperçus
          </h4>
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs text-warning">
              ⚠ La progression de l'amplitude articulaire est au point mort depuis 3 jours. Pic de douleur détecté le jour 5.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary">
              💡 Considérez réduire l'intensité des exercices ou vérifier la gestion de la douleur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
