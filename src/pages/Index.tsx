import { useState } from 'react';
import { Header } from '@/components/Header';
import { PatientContextPanel } from '@/components/PatientContextPanel';
import { ProtocolCanvas } from '@/components/ProtocolCanvas';
import { AICopilotPanel } from '@/components/AICopilotPanel';
import { mockPatient } from '@/data/mockData';
import { ScheduledExercise } from '@/types';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [patient] = useState(mockPatient);

  const handlePublishProtocol = (exercises: ScheduledExercise[]) => {
    // Simulate exporting to patient app
    const protocolJSON = {
      patientId: patient.id,
      patientName: patient.name,
      publishedAt: new Date().toISOString(),
      exercises: exercises.map((e) => ({
        name: e.exercise.name,
        day: e.day,
        params: e.params,
      })),
    };

    console.log('Protocol JSON:', JSON.stringify(protocolJSON, null, 2));

    toast({
      title: 'Protocole Publié',
      description: `${exercises.length} exercices envoyés à l'application de ${patient.name}.`,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Panel - Patient Context */}
        <div className="w-72 flex-shrink-0">
          <PatientContextPanel patient={patient} />
        </div>

        {/* Center Panel - Protocol Canvas */}
        <div className="flex-1 min-w-0">
          <ProtocolCanvas postOpDay={patient.postOpDay} onPublish={handlePublishProtocol} />
        </div>

        {/* Right Panel - AI Copilot */}
        <div className="w-80 flex-shrink-0">
          <AICopilotPanel patientName={patient.name} />
        </div>
      </main>
    </div>
  );
};

export default Index;
