
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  FolderOpen, 
  MessageCircle, 
  BookOpen, 
  FileSearch, 
  Scale,
  LogOut,
  User
} from 'lucide-react';

const features = [
  {
    id: 'docforge',
    title: 'DocForge',
    description: 'Generate legal document templates and download as PDF',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    input: 'Text Input'
  },
  {
    id: 'docsort',
    title: 'DocSort',
    description: 'Classify uploaded legal documents',
    icon: FolderOpen,
    color: 'from-green-500 to-green-600',
    input: 'PDF Upload'
  },
  {
    id: 'justichat',
    title: 'JustiChat',
    description: 'Chatbot for legal questions and answers',
    icon: MessageCircle,
    color: 'from-purple-500 to-purple-600',
    input: 'Interactive Chat'
  },
  {
    id: 'lawlumen',
    title: 'LawLumen',
    description: 'Explain legal terms and text',
    icon: BookOpen,
    color: 'from-orange-500 to-orange-600',
    input: 'Text Input'
  },
  {
    id: 'lexbrief',
    title: 'LexBrief',
    description: 'Summarize long case files',
    icon: FileSearch,
    color: 'from-red-500 to-red-600',
    input: 'PDF Upload'
  },
  {
    id: 'precedentpro',
    title: 'PrecedentPro',
    description: 'Retrieve legal precedents',
    icon: Scale,
    color: 'from-indigo-500 to-indigo-600',
    input: 'Text Input'
  }
];

interface DashboardProps {
  onFeatureSelect: (featureId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onFeatureSelect }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-legal-light via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-legal-neutral/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-legal-primary to-legal-secondary rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-legal-dark">Legal Assistant Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-legal-neutral">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-legal-neutral/30 hover:bg-legal-primary hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-legal-dark mb-4">Welcome to Your Legal Productivity Suite</h2>
          <p className="text-lg text-legal-neutral max-w-2xl mx-auto">
            Choose from our comprehensive set of AI-powered legal tools designed to streamline your workflow and enhance your legal practice.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onFeatureSelect(feature.id)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-legal-dark group-hover:text-legal-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-legal-neutral">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-legal-neutral bg-legal-light px-3 py-1 rounded-full">
                      {feature.input}
                    </span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-legal-primary to-legal-secondary hover:from-legal-primary/90 hover:to-legal-secondary/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFeatureSelect(feature.id);
                      }}
                    >
                      Launch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
