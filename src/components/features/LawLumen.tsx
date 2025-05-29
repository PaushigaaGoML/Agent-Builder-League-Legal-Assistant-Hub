import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, ArrowLeft, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface LawLumenProps {
  onBack: () => void;
}

interface ExplanationParsed {
  term?: string;
  plainEnglishExplanation?: string;
  example?: string;
  [key: string]: string | undefined;
}

function parseExplanation(raw: string): ExplanationParsed {
  // Parse markdown-like response into an object
  const result: ExplanationParsed = {};
  const termMatch = raw.match(/\*\*Term:\*\*\s*(.+?)\s{2,}/s);
  if (termMatch) result.term = termMatch[1].trim();

  const plainMatch = raw.match(/\*\*Plain English Explanation:\*\*\s*(.+?)\s{2,}/s);
  if (plainMatch) result.plainEnglishExplanation = plainMatch[1].trim();

  const exampleMatch = raw.match(/\*\*Example:\*\*\s*(.+)/s);
  if (exampleMatch) result.example = exampleMatch[1].trim();

  return result;
}

const LawLumen: React.FC<LawLumenProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [explanation, setExplanation] = useState<ExplanationParsed | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleExplain = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "No Text Provided",
        description: "Please enter legal text or terms to explain.",
      });
      return;
    }

    setIsAnalyzing(true);
    setExplanation(null);

    try {
      const response = await axios.post('http://localhost:8000/lawlumen', {
        text: inputText,
      });
      // The API returns { explanation: "..." }
      const parsed = parseExplanation(response.data.explanation || "");
      setExplanation(parsed);
      toast({
        title: "Analysis Complete",
        description: "Legal text has been analyzed and explained.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Failed to analyze text.",
      });
    } finally {
      setIsAnalyzing(false);
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
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legal-dark">LawLumen</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Legal Text Analyzer</CardTitle>
              <CardDescription>
                Enter legal text or terms for clear explanations in plain language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="legalText" className="text-legal-dark font-medium">
                  Legal Text or Terms
                </Label>
                <Textarea
                  id="legalText"
                  placeholder="Paste legal text, contract clauses, or legal terms here for explanation..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[250px] border-legal-neutral/20 resize-none"
                />
              </div>

              <Button
                onClick={handleExplain}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {isAnalyzing ? 'Analyzing Text...' : 'Explain Legal Text'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Plain Language Explanation</CardTitle>
              <CardDescription>
                Clear, understandable breakdown of legal concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {explanation && (explanation.term || explanation.plainEnglishExplanation || explanation.example) ? (
                <div className="space-y-6">
                  {explanation.term && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <span className="font-semibold text-legal-dark">Term:</span>
                      <span className="ml-2 text-blue-900">{explanation.term}</span>
                    </div>
                  )}

                  {explanation.plainEnglishExplanation && (
                    <div>
                      <h4 className="font-semibold text-legal-dark mb-3 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Plain English Explanation
                      </h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-legal-dark">{explanation.plainEnglishExplanation}</p>
                      </div>
                    </div>
                  )}

                  {explanation.example && (
                    <div>
                      <h4 className="font-semibold text-legal-dark mb-3">Example</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-legal-dark">{explanation.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-legal-neutral">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter legal text above to see explanations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawLumen;