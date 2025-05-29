import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Upload, ArrowLeft, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface DocSortProps {
  onBack: () => void;
}

interface ClassificationResult {
  category: string;
  reason: string;
}

function parseClassification(raw: string): ClassificationResult[] {
  // Split by "**Predicted Category:**"
  const blocks = raw.split('**Predicted Category:**').map(s => s.trim()).filter(Boolean);
  return blocks.map(block => {
    const [categoryLine, ...rest] = block.split('\n');
    const category = categoryLine.replace(/\s{2,}/g, ' ').trim();
    const reasonMatch = rest.join('\n').match(/\*\*Reason:\*\*\s*(.+)/s);
    const reason = reasonMatch ? reasonMatch[1].trim() : '';
    return { category, reason };
  });
}

const DocSort: React.FC<DocSortProps> = ({ onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [classification, setClassification] = useState<ClassificationResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setClassification(null);
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

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast({
        variant: "destructive",
        title: "No File",
        description: "Please upload a PDF file first.",
      });
      return;
    }

    setIsAnalyzing(true);
    setClassification(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await axios.post('http://localhost:8000/docsort', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Parse the classification string into structured data
      const parsed = parseClassification(response.data.classification);
      setClassification(parsed);

      toast({
        title: "Analysis Complete",
        description: "Document has been classified successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Failed to classify document.",
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legal-dark">DocSort</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Document Upload</CardTitle>
              <CardDescription>
                Upload a PDF document for intelligent classification
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
                <p className="text-legal-neutral text-sm">PDF files only</p>
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
                onClick={handleAnalyze}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                {isAnalyzing ? 'Analyzing Document...' : 'Analyze & Classify'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Classification Results</CardTitle>
              <CardDescription>
                AI-powered document analysis and categorization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classification && classification.length > 0 ? (
                <div className="space-y-6">
                  {classification.map((item, idx) => (
                    <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="font-semibold text-blue-900 mb-2">
                        {item.category}
                      </div>
                      <div className="text-sm text-blue-800 whitespace-pre-line">
                        {item.reason}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-legal-neutral">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a document to see classification results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocSort;