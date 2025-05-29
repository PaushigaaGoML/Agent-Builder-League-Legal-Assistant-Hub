import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface DocForgeProps {
  onBack: () => void;
}

const DocForge: React.FC<DocForgeProps> = ({ onBack }) => {
  const [documentType, setDocumentType] = useState('');
  const [content, setContent] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const documentTypes = [
    'Contract Agreement',
    'Non-Disclosure Agreement',
    'Terms of Service',
    'Privacy Policy',
    'Employment Agreement',
    'Partnership Agreement',
    'Lease Agreement',
    'Power of Attorney'
  ];

  const handleGenerate = async () => {
    if (!documentType || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a document type and provide content details.",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedDocument(null);
    setPdfBlob(null);

    try {
      const formData = new FormData();
      // Combine type and content for backend as per your API
      formData.append('doc_type', `${documentType}: ${content}`);

      const response = await axios.post('http://localhost:8000/docforge', formData, {
        responseType: 'blob',
      });

      // Try to extract text from PDF for preview (optional, fallback to message)
      const pdfBlob = response.data as Blob;
      setPdfBlob(pdfBlob);

      // Optionally, show a message or preview
      setGeneratedDocument(
        `Your document has been generated. Click "Download as PDF Template" to download the file.`
      );

      toast({
        title: "Document Generated",
        description: "Your legal document template has been created successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Failed to generate document.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${documentType.replace(/\s+/g, '_')}_template.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your legal document template is being downloaded.",
    });
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legal-dark">DocForge</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Document Generator</CardTitle>
              <CardDescription>
                Create professional legal document templates with ease
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="documentType" className="text-legal-dark font-medium">
                  Document Type
                </Label>
                <Select onValueChange={setDocumentType}>
                  <SelectTrigger className="border-legal-neutral/20">
                    <SelectValue placeholder="Select a document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-legal-dark font-medium">
                  Document Details
                </Label>
                <Textarea
                  id="content"
                  placeholder="Describe the specific terms, conditions, or requirements for your document..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] border-legal-neutral/20 resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                {isGenerating ? 'Generating Document...' : 'Generate Document'}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-legal-dark">Generated Document</CardTitle>
              <CardDescription>
                Your customized legal document template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedDocument ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-legal-dark font-mono">
                      {generatedDocument}
                    </pre>
                  </div>
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    disabled={!pdfBlob}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download as PDF Template
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-legal-neutral">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generated document will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocForge;