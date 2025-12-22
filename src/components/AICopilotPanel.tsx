import { useState } from 'react';
import { AIMessage, EvidenceResult } from '@/types';
import { mockEvidenceResults, doctor } from '@/data/mockData';
import {
  Bot,
  Search,
  Send,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  FileText,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AICopilotPanelProps {
  patientName: string;
}

// Initial assistant message will use the editable doctor name from the JSON

const suggestions = [
  "Pourquoi l'amplitude stagne-t-elle?",
  "Générer un protocole LCA de Phase 2",
  "Vérifier les contre-indications",
  "Recommander des ajustements de gestion de la douleur",
];

export function AICopilotPanel({ patientName }: AICopilotPanelProps) {
  const [activeTab, setActiveTab] = useState<'copilot' | 'evidence'>('copilot');
  const [messages, setMessages] = useState<AIMessage[]>(() => [
    {
      id: '1',
      role: 'assistant',
      content: `Bonjour ${doctor.name}! Je suis prêt à vous aider avec le protocole de réadaptation de ${patientName}. J'ai remarqué que son amplitude articulaire a stagné et son adhésion est en dessous de la cible. Voulez-vous que j'analyse la situation?`,
      timestamp: new Date(),
      type: 'info',
    },
  ]);
  const [input, setInput] = useState('');
  const [evidenceSearch, setEvidenceSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
        type: determineMessageType(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('rom') && lowerQuery.includes('stall')) {
      return `En fonction de mon analyse des données de ${patientName}:\n\n**Analyse des Causes Profondes:**\n• L'adhésion a baissé à 72% (cible: 85%)\n• Le pic de douleur du jour 5 correspond à l'augmentation de l'intensité\n• Le patient peut éviter les exercices en raison de l'inconfort\n\n**Recommandations:**\n1. Réduire l'intensité de 20% pour les glissements des talons\n2. Ajouter des exercices de gestion de la douleur avant le travail d'amplitude\n3. Envisager des sessions plus courtes et plus fréquentes\n\nVoulez-vous que j'ajuste automatiquement le protocole?`;
    }
    
    if (lowerQuery.includes('generate') && lowerQuery.includes('phase')) {
      return `Je peux générer un protocole LCA de Phase 2 basé sur les directives actuelles et la progression de ${patientName}.\n\n**Phase 2 Proposée (Semaines 3-6):**\n• Objectif: Restaurer l'amplitude articulaire à 120°\n• Ajouter des exercices en chaîne fermée\n• Introduire le vélo stationnaire (faible résistance)\n• Continuer le renforcement des quadriceps\n\nDois-je remplir la chronologie avec les exercices recommandés?`;
    }
    
    if (lowerQuery.includes('contraindication')) {
      return `**Contre-indications Actuelles pour le Jour ${21}:**\n\n⚠️ **À Éviter:**\n• Squats avec sauts (nécessite 8+ semaines)\n• Course (nécessite 12+ semaines)\n• Plateau d'équilibre (nécessite 6+ semaines)\n\n✅ **Sûr à Inclure:**\n• Séries de quadriceps, glissements des talons\n• Relevés de jambe tendue\n• Mini squats (avec prudence)\n• Vélo stationnaire (faible résistance)`;
    }
    
    return `Je comprends que vous posez une question sur "${query}". En fonction du statut actuel de ${patientName} et des directives de réadaptation, je recommande de consulter le navigateur de preuves pour les protocoles spécifiques. Voulez-vous que je recherche des études pertinentes?`;
  };

  const determineMessageType = (query: string): 'suggestion' | 'warning' | 'info' => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('contraindication') || lowerQuery.includes('warning')) return 'warning';
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) return 'suggestion';
    return 'info';
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-primary" />;
      default:
        return <Sparkles className="w-4 h-4 text-chart-2" />;
    }
  };

  const filteredEvidence = mockEvidenceResults.filter(
    (e) =>
      evidenceSearch === '' ||
      e.title.toLowerCase().includes(evidenceSearch.toLowerCase()) ||
      e.summary.toLowerCase().includes(evidenceSearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col panel overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between px-3 py-2">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          Copilote IA
        </h2>
        <span className="text-xs text-muted-foreground">COMMENT</span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'copilot' | 'evidence')} className="flex-1 flex flex-col overflow-hidden min-h-0">
        <TabsList className="mx-3 mt-2 grid grid-cols-2 gap-1">
          <TabsTrigger value="copilot" className="text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Copilote
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Preuves
          </TabsTrigger>
        </TabsList>

        {/* Copilot Tab */}
        <TabsContent value="copilot" className="flex-1 flex flex-col overflow-hidden m-0 min-h-0 p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-2 min-h-0">
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`animate-slide-up ${
                    message.role === 'assistant' ? 'ai-message' : 'user-message'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-2">
                      {getMessageIcon(message.type)}
                      <span className="text-xs font-medium text-primary">Copilote IA</span>
                    </div>
                  )}
                  <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                  <span className="text-[10px] text-muted-foreground mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="ai-message">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                    </div>
                    <span className="text-xs text-muted-foreground">Analyse en cours...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          <div className="px-3 py-1 border-t border-border flex-shrink-0">
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 text-xs"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Input (anchored via flex layout) */}
          <div className="px-2 pb-2 pt-2 border-t border-border bg-background flex-shrink-0 relative z-20">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez une question au copilote IA..."
                className="bg-secondary"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button size="sm" onClick={handleSendMessage} disabled={!input.trim() || isTyping} className="h-9 w-9 p-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="flex-1 flex flex-col overflow-hidden m-0 min-h-0 p-0">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={evidenceSearch}
                onChange={(e) => setEvidenceSearch(e.target.value)}
                placeholder="Rechercher directives, articles..."
                className="pl-9 bg-secondary"
              />
            </div>
          </div>

          {/* Results */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-3">
              {filteredEvidence.map((result) => (
                <div
                  key={result.id}
                  className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">
                        {result.title}
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                      {result.relevance}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{result.source}</p>
                  <p className="text-xs text-foreground/80 mb-3">{result.summary}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" className="text-xs h-7">
                      <Plus className="w-3 h-3 mr-1" />
                      Appliquer au Protocole
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
