import { Activity, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { doctor } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Cockpit du Clinicien</h1>
          <p className="text-xs text-muted-foreground">Centre de Commande de Réadaptation</p>
        </div>
      </div>

      {/* Center - Protocol Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-foreground">Système En Ligne</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          v1.1.0
        </Badge>
      </div>

      {/* Right - User Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="ml-3 hidden sm:inline-flex" onClick={() => navigate('/select-patient')}>
          Changer patient
        </Button>
        <Button variant="ghost" size="sm" className="ml-1 hidden sm:inline-flex" onClick={() => navigate('/exercises')}>
          Exercices
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Dr. {doctor.name}</p>
              <p className="text-xs text-muted-foreground">{doctor.department}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
