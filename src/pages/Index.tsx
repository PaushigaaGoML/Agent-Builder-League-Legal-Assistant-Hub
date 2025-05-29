
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import DocForge from '@/components/features/DocForge';
import DocSort from '@/components/features/DocSort';
import JustiChat from '@/components/features/JustiChat';
import LawLumen from '@/components/features/LawLumen';
import LexBrief from '@/components/features/LexBrief';
import PrecedentPro from '@/components/features/PrecedentPro';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);

  const handleFeatureSelect = (featureId: string) => {
    setCurrentFeature(featureId);
  };

  const handleBackToDashboard = () => {
    setCurrentFeature(null);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  // Render specific feature components
  switch (currentFeature) {
    case 'docforge':
      return <DocForge onBack={handleBackToDashboard} />;
    case 'docsort':
      return <DocSort onBack={handleBackToDashboard} />;
    case 'justichat':
      return <JustiChat onBack={handleBackToDashboard} />;
    case 'lawlumen':
      return <LawLumen onBack={handleBackToDashboard} />;
    case 'lexbrief':
      return <LexBrief onBack={handleBackToDashboard} />;
    case 'precedentpro':
      return <PrecedentPro onBack={handleBackToDashboard} />;
    default:
      return <Dashboard onFeatureSelect={handleFeatureSelect} />;
  }
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
