import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scale, ArrowLeft, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface PrecedentProProps {
  onBack: () => void;
}

// Helper to parse the API's markdown-like precedents string into an array of objects
function parsePrecedents(raw: string): { title: string; description: string }[] {
  // Remove "**Relevant Precedents:**" and split by numbered items
  const lines = raw.replace(/\*\*Relevant Precedents:\*\*\s*/i, '').split(/\n\d+\.\s*/).filter(Boolean);
  return lines.map(line => {
    // Try to split by "–" or "-" for title and description
    const match = line.match(/^\*?(.+?)\*?\s*[–-]\s*(.+)$/s);
    if (match) {
      return {
        title: match[1].replace(/^\*|\*$/g, '').trim(),
        description: match[2].trim(),
      };
    }
    return { title: line.trim(), description: '' };
  });
}

const PrecedentPro: React.FC<PrecedentProProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [precedents, setPrecedents] = useState<{ title: string; description: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "No Search Query",
        description: "Please enter a legal query to search for precedents.",
      });
      return;
    }

    setIsSearching(true);
    setPrecedents([]);

    try {
      const response = await axios.post('http://localhost:8000/precedentpro', {
        text: searchQuery
      });
      // The API returns { precedents: string }
      const parsed = parsePrecedents(response.data.precedents || '');
      setPrecedents(parsed);
      toast({
        title: "Search Complete",
        description: `Found ${parsed.length} relevant precedents.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Failed to search precedents.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-legal-light via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="mr-4 border-legal-neutral/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legal-dark">PrecedentPro</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg col-span-1">
            <CardHeader>
              <CardTitle className="text-legal-dark">Search Legal Precedents</CardTitle>
              <CardDescription>
                Find relevant case law and legal precedents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="searchQuery" className="text-legal-dark font-medium">
                  Case Brief / Legal Query
                </Label>
                <Textarea
                  id="searchQuery"
                  placeholder="Enter your case brief or legal question to find precedents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-h-[120px] border-legal-neutral/20 resize-none"
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search Precedents'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Search Results</CardTitle>
              <CardDescription>
                Relevant legal precedents and case law
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {precedents.length > 0 ? (
                <div className="space-y-6">
                  {precedents.map((precedent, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-2">
                        <h3 className="font-bold text-legal-dark text-lg">{precedent.title}</h3>
                      </div>
                      <div>
                        <p className="text-sm text-legal-neutral">{precedent.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-legal-neutral">
                  <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a case brief or query to find relevant legal precedents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrecedentPro;