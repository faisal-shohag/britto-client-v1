import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import api from '@/lib/api';

const BulkQuestionUploader = () => {
  const [examId, setExamId] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [jsonData, setJsonData] = useState('');
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null) as any;

  // Sample JSON structure for reference
  const sampleJson = {
    questions: [
      {
        question: "What is the capital of France?",
        description: "Geography question about European capitals",
        explanation: "Paris is the capital and largest city of France.",
        difficulty: "EASY",
        subject: "Geography",
        topic: "World Capitals",
        image: null,
        options: [
          { optionText: "London", description: null, image: null, isCorrect: false, optionOrder: 1 },
          { optionText: "Berlin", description: null, image: null, isCorrect: false, optionOrder: 2 },
          { optionText: "Paris", description: null, image: null, isCorrect: true, optionOrder: 3 },
          { optionText: "Madrid", description: null, image: null, isCorrect: false, optionOrder: 4 }
        ]
      }
    ]
  };

  // Bulk upload mutation
  const bulkUploadMutation:any = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/freeExam/bulk-question-add', data);
      return response.data;
    },
    onSuccess: (data:any) => {
      // Reset form on success
      console.log(data)
      setFile(null);
      setJsonData('');
      setPreviewData(null);
      setExamId('');
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      // Preview file content
      const reader = new FileReader();
      reader.onload = (event:any) => {
        try {
          const data = JSON.parse(event.target.result);
          setPreviewData(data);
        } catch (error) {
          // Error will be handled by the mutation
          console.log(error)
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    try {
      if (e.target.value.trim()) {
        const data = JSON.parse(e.target.value);
        setPreviewData(data);
      }
    } catch (error) {
        console.log(error)
      setPreviewData(null);
    }
  };

  const validateQuestionData = (data) => {
    if (!data.questions || !Array.isArray(data.questions)) {
      return 'Data must have a "questions" array';
    }

    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      if (!q.question || typeof q.question !== 'string') {
        return `Question ${i + 1}: Missing or invalid question text`;
      }
      if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
        return `Question ${i + 1}: Must have at least 2 options`;
      }
      
      const correctOptions = q.options.filter(opt => opt.isCorrect);
      if (correctOptions.length !== 1) {
        return `Question ${i + 1}: Must have exactly one correct option`;
      }

      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j];
        if (!opt.optionText || typeof opt.optionText !== 'string') {
          return `Question ${i + 1}, Option ${j + 1}: Missing option text`;
        }
        if (typeof opt.isCorrect !== 'boolean') {
          return `Question ${i + 1}, Option ${j + 1}: isCorrect must be boolean`;
        }
        if (!opt.optionOrder || typeof opt.optionOrder !== 'number') {
          return `Question ${i + 1}, Option ${j + 1}: Missing optionOrder`;
        }
      }
    }
    return null;
  };

  const handleUpload = async () => {
    if (!examId) {
      return;
    }

    let dataToUpload;
    if (uploadMethod === 'file') {
      if (!file) {
        return;
      }
      dataToUpload = previewData;
    } else {
      if (!jsonData.trim()) {
        return;
      }
      try {
        dataToUpload = JSON.parse(jsonData);
      } catch (error) {
             console.log(error)
        return;
      }
    }

    // Validate data structure
    const validationError = validateQuestionData(dataToUpload);
    if (validationError) {
      return;
    }

    bulkUploadMutation.mutate({
      examId: parseInt(examId),
      questions: dataToUpload.questions
    });
  };

  const isFormValid = examId && ((uploadMethod === 'file' && file && previewData) || (uploadMethod === 'json' && jsonData.trim() && previewData));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Bulk Question Upload
          </CardTitle>
          <CardDescription>
            Upload multiple questions with options to an exam using JSON data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exam ID Input */}
          <div className="space-y-2">
            <Label htmlFor="examId">
              Exam ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="examId"
              type="number"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              placeholder="Enter exam ID"
              className="max-w-xs"
            />
          </div>

          {/* Upload Method Selection */}
          <div className="space-y-3">
            <Label>Upload Method</Label>
            <RadioGroup value={uploadMethod} onValueChange={setUploadMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file">Upload JSON File</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">Paste JSON Data</Label>
              </div>
            </RadioGroup>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select JSON File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </div>
          )}

          {/* JSON Text Input */}
          {uploadMethod === 'json' && (
            <div className="space-y-2">
              <Label htmlFor="json-input">JSON Data</Label>
              <Textarea
                id="json-input"
                value={jsonData}
                onChange={handleJsonChange}
                rows={10}
                className="font-mono text-sm"
                placeholder="Paste your JSON data here..."
              />
            </div>
          )}

          {/* Sample JSON Structure */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary">
              📋 View Sample JSON Structure
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(sampleJson, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Preview */}
          {previewData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Preview ({previewData.questions?.length || 0} questions)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {previewData.questions?.slice(0, 3).map((q, i) => (
                    <div key={i} className="border-l-2 border-primary pl-3">
                      <div className="font-medium text-sm">Q{i + 1}: {q.question}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2">
                          {q.options?.length || 0} options
                        </Badge>
                        <Badge variant="secondary">
                          Correct: {q.options?.find(o => o.isCorrect)?.optionText}
                        </Badge>
                        {q.difficulty && (
                          <Badge variant="outline" className="ml-2">
                            {q.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {previewData.questions?.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      ... and {previewData.questions.length - 3} more questions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!isFormValid || bulkUploadMutation.isPending}
            className="w-full"
            size="lg"
          >
            {bulkUploadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Questions
              </>
            )}
          </Button>

          {/* Result Messages */}
          {bulkUploadMutation.isSuccess && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription className="flex flex-col gap-1">
                <span className="font-medium">
                  {bulkUploadMutation.data.message}
                </span>
                <span className="text-sm">
                  Questions created: {bulkUploadMutation.data.createdCount} | 
                  Options created: {bulkUploadMutation.data.optionsCreated}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {bulkUploadMutation.isError && (
            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>
                {bulkUploadMutation.error?.response?.data?.error || 
                 bulkUploadMutation.error?.message || 
                 'Upload failed'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Each question must have at least 2 options</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Exactly one option must be marked as correct (isCorrect: true)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>optionOrder should be 1, 2, 3, 4 for A, B, C, D respectively</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Difficulty must be "EASY", "MEDIUM", or "HARD"</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>All required fields must be provided</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkQuestionUploader;