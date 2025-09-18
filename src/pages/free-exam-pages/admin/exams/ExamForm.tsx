import React, { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';
import { Upload, X, Image as ImageIcon, Calendar, Clock, Target } from 'lucide-react';
import type { CreateExamData } from '@/hooks/free-exam-hooks/use-exams';
import { usePackages } from '@/hooks/free-exam-hooks/use-packages';
import { format } from 'date-fns';

const formSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title too long"),
    type: z.string().optional(),
    description: z.string().optional(),
    totalMarks: z.number().min(1, "Total marks must be at least 1").default(100),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    durationInMinutes: z.number().min(1, "Duration must be at least 1 minute"),
    negativeMark: z.number().min(0, "Negative mark cannot be negative").default(0),
    image: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
    userId: z.number().min(1, "User ID is required"),
    // Make packageId optional so defaultValues can be undefined
    packageId: z.number().min(1, "Package is required").optional(),
  })
  .refine((data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type FormData = z.infer<typeof formSchema>;

interface ExamFormProps {
  initialData?: Partial<CreateExamData> & { id?: number };
  onSubmit: (data: CreateExamData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  currentUserId: number;
}

const statusOptions = [
  { value: 'DRAFT', label: 'Draft', color: 'text-zinc-400', bgColor: 'bg-zinc-500/10' },
  { value: 'PUBLISHED', label: 'Published', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { value: 'ACTIVE', label: 'Active', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { value: 'COMPLETED', label: 'Completed', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  { value: 'ARCHIVED', label: 'Archived', color: 'text-red-400', bgColor: 'bg-red-500/10' },
];

export const ExamForm: React.FC<ExamFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Create Exam',
  currentUserId,
}) => {
  const [previewImage, setPreviewImage] = useState<string>(initialData?.image || '');
  const [calculateDuration, setCalculateDuration] = useState(true);
  
  const { data: packagesData } = usePackages({ limit: 100 });
  
  const form = useForm<FormData>({
  // cast resolver so types line up exactly
  resolver: zodResolver(formSchema) as unknown as Resolver<FormData>,
  defaultValues: {
    title: initialData?.title ?? "",
    type: initialData?.type ?? "",
    description: initialData?.description ?? "",
    totalMarks: initialData?.totalMarks ?? 100,
    startTime: initialData?.startTime ? format(new Date(initialData.startTime), "yyyy-MM-dd'T'HH:mm") : "",
    endTime: initialData?.endTime ? format(new Date(initialData.endTime), "yyyy-MM-dd'T'HH:mm") : "",
    durationInMinutes: initialData?.durationInMinutes ?? 60,
    negativeMark: initialData?.negativeMark ?? 0,
    image: initialData?.image ?? "",
    status: (initialData?.status as FormData["status"]) ?? "DRAFT",
    userId: initialData?.userId ?? currentUserId,
    packageId: initialData?.packageId ?? undefined, // allowed by optional schema
  },
});

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        form.setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    form.setValue('image', '');
  };

  const handleSubmit = (data: FormData) => {
    console.log(data)
    onSubmit(data as CreateExamData);
  };

  // Watch form values for preview and auto-calculations
  const watchedValues = form.watch();
  const selectedPackage = packagesData?.packages.find(pkg => pkg.id === watchedValues.packageId);
  const selectedStatus = statusOptions.find(opt => opt.value === watchedValues.status);

  // Auto-calculate duration when times change
  React.useEffect(() => {
    if (calculateDuration && watchedValues.startTime && watchedValues.endTime) {
      const start = new Date(watchedValues.startTime);
      const end = new Date(watchedValues.endTime);
      if (end > start) {
        const durationMs = end.getTime() - start.getTime();
        const durationMinutes = Math.round(durationMs / (1000 * 60));
        form.setValue('durationInMinutes', durationMinutes);
      }
    }
  }, [watchedValues.startTime, watchedValues.endTime, calculateDuration, form]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100">
          {initialData?.id ? 'Edit Exam' : 'Create New Exam'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, (err) =>{console.log(err)})} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Exam Image</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-zinc-700">
                  <AvatarImage src={previewImage} alt="Exam preview" />
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
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    
                    {previewImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Upload a square image (recommended: 400x400px)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-zinc-300">Exam Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter exam title..."
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Package Selection */}
              <FormField
                control={form.control}
                name="packageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Package</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {packagesData?.packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id.toString()} className="text-zinc-300 hover:bg-zinc-800">
                            <div className="flex items-center gap-2">
                              <span>{pkg.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {pkg.group}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-zinc-300 hover:bg-zinc-800">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${status.bgColor}`} />
                              <span className={status.color}>{status.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Exam Type (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Mock Test, Practice"
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Total Marks */}
              <FormField
                control={form.control}
                name="totalMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Total Marks</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-zinc-400" />
                <h3 className="text-lg font-medium text-zinc-200">Schedule</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Start Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* End Time */}
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">End Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-zinc-300">Duration (minutes)</FormLabel>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={calculateDuration}
                      onCheckedChange={setCalculateDuration}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm text-zinc-400">Auto-calculate</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="durationInMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          disabled={calculateDuration}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Negative Marking */}
            <FormField
              control={form.control}
              name="negativeMark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Negative Marking</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.25"
                      placeholder="0"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    />
                  </FormControl>
                  <p className="text-xs text-zinc-500">
                    Marks deducted for wrong answers (0 for no negative marking)
                  </p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter exam description..."
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Preview Card */}
            {watchedValues.title && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Preview</Label>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2 border-zinc-700">
                        <AvatarImage src={previewImage} alt="Preview" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                          {watchedValues.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-zinc-100">
                            {watchedValues.title}
                          </h3>
                          {selectedStatus && (
                            <Badge variant="outline" className={`${selectedStatus.bgColor} ${selectedStatus.color} border text-xs`}>
                              {selectedStatus.label}
                            </Badge>
                          )}
                        </div>
                        
                        {selectedPackage && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-zinc-500">{selectedPackage.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {selectedPackage.group}
                            </Badge>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Clock className="h-3 w-3" />
                            <span>{watchedValues.durationInMinutes}min</span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Target className="h-3 w-3" />
                            <span>{watchedValues.totalMarks} marks</span>
                          </div>
                          <div className="text-sm text-zinc-400">
                            Negative: {watchedValues.negativeMark}
                          </div>
                        </div>

                        {watchedValues.description && (
                          <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                            {watchedValues.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                {isLoading ? 'Saving...' : submitLabel}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
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
