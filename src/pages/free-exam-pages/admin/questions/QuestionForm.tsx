// components/question-form.tsx
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, HelpCircle, CheckCircle, Plus } from 'lucide-react';
import type { CreateQuestionData, Question } from '@/hooks/free-exam-hooks/use-questions';

const formSchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters').max(500, 'Question too long'),
  description: z.string().optional(),
  explanation: z.string().optional(),
  image: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  correctOption: z.number().min(1, 'Select the correct option'),
  options: z.array(
    z.object({
      optionText: z.string().min(1, 'Option text is required'),
      description: z.string().optional(),
      image: z.string().optional(),
    })
  ).min(2, 'At least 2 options required').max(5, 'Maximum 5 options allowed'),
}).refine((data) => data.correctOption <= data.options.length, {
  message: 'Correct option must be within the number of options',
  path: ['correctOption'],
});

type FormData = z.infer<typeof formSchema>;

interface QuestionFormProps {
  initialData?: Partial<Question>;
  onSubmit: (data: CreateQuestionData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const difficultyOptions = [
  { value: 'EASY', label: 'Easy', color: 'text-green-400', bg: 'bg-green-500/10' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { value: 'HARD', label: 'Hard', color: 'text-red-400', bg: 'bg-red-500/10' },
];

export const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Create Question',
}) => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(initialData?.image);
  const [optionPreviews, setOptionPreviews] = useState<string[]>(
    initialData?.options?.map(opt => opt.image || '') || []
  );

  // Find initial correct option
  const initialCorrect = initialData?.options?.find(opt => opt.isCorrect)?.optionOrder ||
    initialData?.correctOption ||
    1;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: initialData?.question || '',
      description: initialData?.description || '',
      explanation: initialData?.explanation || '',
      image: initialData?.image || '',
      difficulty: initialData?.difficulty,
      subject: initialData?.subject || '',
      topic: initialData?.topic || '',
      correctOption: initialCorrect,
      options: initialData?.options?.sort((a, b) => a.optionOrder - b.optionOrder).map(opt => ({
        optionText: opt.optionText,
        description: opt.description || '',
        image: opt.image || '',
      })) || [
        { optionText: '', description: '', image: '' },
        { optionText: '', description: '', image: '' },
        { optionText: '', description: '', image: '' },
        { optionText: '', description: '', image: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const watched = form.watch();

  const handleQuestionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        form.setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQuestionImage = () => {
    setPreviewImage(undefined);
    form.setValue('image', '');
  };

  const handleOptionImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOptionPreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = result;
          return newPreviews;
        });
        form.setValue(`options.${index}.image`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveOptionImage = (index: number) => {
    setOptionPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = '';
      return newPreviews;
    });
    form.setValue(`options.${index}.image`, '');
  };

  const handleSubmit = (data: FormData) => {
    const preparedOptions = data.options.map((opt, idx) => ({
      ...opt,
      optionOrder: idx + 1,
      isCorrect: idx + 1 === data.correctOption,
    }));



    const submitData: CreateQuestionData = {
      ...data,
      options: {
        create: preparedOptions
      },
    };

    onSubmit(submitData);
  };

  const selectedDifficulty = difficultyOptions.find(opt => opt.value === watched.difficulty);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100">
          {initialData?.id ? 'Edit Question' : 'Create New Question'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Question Image */}
            <div className="space-y-2 hidden">
              <Label className="text-zinc-300">Question Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-zinc-700">
                  <AvatarImage src={previewImage} alt="Question preview" />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">
                    <ImageIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 relative overflow-hidden"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQuestionImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    {previewImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveQuestionImage}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">Recommended: 800x400px</p>
                </div>
              </div>
            </div>

            {/* Main Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-zinc-300">Question Text</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the question..."
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* <FormField
              
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-zinc-300">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional context or instructions..."
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Subject (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Mathematics"
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Topic (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Algebra"
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Difficulty (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {difficultyOptions.map((opt) => (
                          <SelectItem 
                            key={opt.value} 
                            value={opt.value}
                            className="text-zinc-300 hover:bg-zinc-800"
                          >
                            <span className={opt.color}>{opt.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
            </div>

            {/* Options Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-zinc-400" />
                  <h3 className="text-lg font-medium text-zinc-200">Options</h3>
                </div>
                {fields.length < 5 && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ optionText: '', description: '', image: '' })}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                  </Button>
                )}
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-200">Option {index + 1}</span>
                      {fields.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`options.${index}.optionText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter option text..."
                              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
{/* 
                    <FormField
                      control={form.control}
                      name={`options.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Option Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Additional explanation for this option..."
                              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[60px]"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    /> */}

                    <div className="space-y-2 hidden">
                      <Label className="text-zinc-300">Option Image (Optional)</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-zinc-700">
                          <AvatarImage src={optionPreviews[index]} alt={`Option ${index + 1} preview`} />
                          <AvatarFallback className="bg-zinc-800 text-zinc-400">
                            <ImageIcon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 relative overflow-hidden"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleOptionImageChange(index, e)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </Button>
                            {optionPreviews[index] && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveOptionImage(index)}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500">Recommended: 400x200px</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Correct Option */}
            <FormField
              control={form.control}
              name="correctOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Correct Option</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectValue placeholder="Select correct option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {fields.map((_, index) => (
                        <SelectItem 
                          key={index} 
                          value={(index + 1).toString()}
                          className="text-zinc-300 hover:bg-zinc-800"
                        >
                          Option {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Explanation */}
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Explanation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Explain why the correct answer is right..."
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Preview */}
            {watched.question && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Preview</Label>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-zinc-100 mb-2">{watched.question}</h3>
                      {watched.description && <p className="text-sm text-zinc-400 mb-2">{watched.description}</p>}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedDifficulty && (
                        <Badge className={`${selectedDifficulty.bg} ${selectedDifficulty.color}`}>
                          {selectedDifficulty.label}
                        </Badge>
                      )}
                      {watched.subject && (
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                          {watched.subject}
                        </Badge>
                      )}
                      {watched.topic && (
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                          {watched.topic}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      {watched.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-md border flex items-start gap-3 ${
                            idx + 1 === watched.correctOption
                              ? 'border-green-500/20 bg-green-500/10'
                              : 'border-zinc-700 bg-zinc-800/50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-zinc-100">Option {idx + 1}:</span>
                              <span className="text-zinc-300">{opt.optionText}</span>
                              {idx + 1 === watched.correctOption && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                            </div>
                            {opt.description && <p className="text-sm text-zinc-400">{opt.description}</p>}
                          </div>
                          {opt.image && (
                            <img 
                              src={opt.image} 
                              alt={`Option ${idx + 1}`} 
                              className="h-16 w-16 object-cover rounded-md" 
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {watched.explanation && (
                      <div className="p-3 bg-zinc-800/50 rounded-md border border-zinc-700">
                        <h4 className="text-sm font-medium text-zinc-200 mb-1">Explanation</h4>
                        <p className="text-sm text-zinc-400">{watched.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Submitting...' : submitLabel}
              </Button>
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};