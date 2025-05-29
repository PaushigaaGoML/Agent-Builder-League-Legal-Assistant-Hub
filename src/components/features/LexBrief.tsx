import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, Upload, ArrowLeft, File, Clock, Users, Gavel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface LexBriefProps {
  onBack: () => void;
}

const LexBrief: React.FC<LexBriefProps> = ({ onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setSummary(null);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a PDF file.",
      });
    }
  };

  const handleSummarize = async () => {
    if (!uploadedFile) {
      toast({
        variant: "destructive",
        title: "No File",
        description: "Please upload a PDF file first.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await axios.post('http://localhost:8000/lexbrief', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // The API returns { summary: ... }
      // If summary is a string, try to parse as JSON, else use as is
      let summaryData = response.data.summary;
      if (typeof summaryData === 'string') {
        try {
          summaryData = JSON.parse(summaryData);
        } catch {
          // If not JSON, fallback to plain string
        }
      }
      setSummary(summaryData);
      toast({
        title: "Summary Complete",
        description: "Case file has been analyzed and summarized.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Failed to summarize file.",
      });
    } finally {
      setIsProcessing(false);
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legal-dark">LexBrief</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Case File Upload</CardTitle>
              <CardDescription>
                Upload a PDF case file for intelligent summarization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className="border-2 border-dashed border-legal-neutral/30 rounded-lg p-8 text-center cursor-pointer hover:border-legal-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-legal-neutral" />
                <p className="text-legal-dark font-medium mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-legal-neutral text-sm">PDF case files only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <File className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{uploadedFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSummarize}
                disabled={!uploadedFile || isProcessing}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                {isProcessing ? 'Processing Case File...' : 'Generate Summary'}
              </Button>
            </CardContent>
          </Card>

          {/* Summary Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Case Summary</CardTitle>
              <CardDescription>
                Comprehensive analysis and key points extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {summary ? (
                typeof summary === 'string' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-legal-dark whitespace-pre-line">{summary}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Case Header */}
                    {summary.caseTitle && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-bold text-legal-dark text-lg mb-2">{summary.caseTitle}</h3>
                        <div className="flex items-center justify-between">
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {summary.caseType}
                          </span>
                          <span className="text-sm text-red-600">{summary.outcome}</span>
                        </div>
                      </div>
                    )}

                    {/* Parties */}
                    {summary.parties && (
                      <div>
                        <h4 className="font-semibold text-legal-dark mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Parties Involved
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-800">Plaintiff</p>
                            <p className="text-blue-600">{summary.parties.plaintiff}</p>
                          </div>
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-orange-800">Defendant</p>
                            <p className="text-orange-600">{summary.parties.defendant}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Key Facts */}
                    {summary.keyFacts && (
                      <div>
                        <h4 className="font-semibold text-legal-dark mb-3">Key Facts</h4>
                        <ul className="space-y-2">
                          {summary.keyFacts.map((fact: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                              <span className="text-legal-neutral text-sm">{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Legal Issues */}
                    {summary.legalIssues && (
                      <div>
                        <h4 className="font-semibold text-legal-dark mb-3 flex items-center">
                          <Gavel className="w-4 h-4 mr-2" />
                          Legal Issues
                        </h4>
                        <ul className="space-y-2">
                          {summary.legalIssues.map((issue: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-legal-primary rounded-full mt-2" />
                              <span className="text-legal-neutral text-sm">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Procedural History */}
                    {summary.proceduralHistory && (
                      <div>
                        <h4 className="font-semibold text-legal-dark mb-3">Procedural History</h4>
                        <ul className="space-y-2">
                          {summary.proceduralHistory.map((item: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                              <span className="text-legal-neutral text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Dates */}
                    {summary.keyDates && (
                      <div>
                        <h4 className="font-semibold text-legal-dark mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Key Dates
                        </h4>
                        <div className="space-y-2">
                          {summary.keyDates.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                              <span className="text-sm font-medium text-legal-dark">{item.event}</span>
                              <span className="text-sm text-legal-neutral">{item.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {summary.recommendations && (
                      <div>
                        <h4 className="font-semibold text-legal-dark mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                          {summary.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                              <span className="text-legal-neutral text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-legal-neutral">
                  <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a case file to see comprehensive summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LexBrief;