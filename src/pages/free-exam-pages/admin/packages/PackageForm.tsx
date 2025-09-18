import React from 'react';
import { useForm } from 'react-hook-form';
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
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import type { CreatePackageData } from '@/hooks/free-exam-hooks/use-packages';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().optional(),
  group: z.enum(['SCIENCE', 'ARTS', 'COMMERCE', 'HUAMANITY']),
  image: z.string().optional(),
}).refine((data) => data.group !== undefined, {
  message: 'Please select a group',
  path: ['group'], // Specify the field for the error
});

type FormData = z.infer<typeof formSchema>;

interface PackageFormProps {
  initialData?: Partial<CreatePackageData>;
  onSubmit: (data: CreatePackageData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const groupOptions:any = [
  { value: 'SCIENCE', label: 'Science', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { value: 'ARTS', label: 'Arts', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { value: 'COMMERCE', label: 'Commerce', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { value: 'HUAMANITY', label: 'HUAMANITY', color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
];

export const PackageForm: React.FC<PackageFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Create Package',
}) => {
  const [previewImage, setPreviewImage] = React.useState<string>(initialData?.image || '');
  // const [imageFile, setImageFile] = React.useState<File | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      group: initialData?.group || undefined as any,
      image: initialData?.image || '',
    },
  });

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setImageFile(file);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const result = e.target?.result as string;
  //       setPreviewImage(result);
  //       form.setValue('image', result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleRemoveImage = () => {
    setPreviewImage('');
    // setImageFile(null);
    form.setValue('image', '');
  };

  const handleSubmit = (data: FormData) => {
    onSubmit(data as CreatePackageData);
  };

  const selectedGroup = form.watch('group');
  const selectedGroupOption = groupOptions.find(opt => opt.value === selectedGroup);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100">
          {initialData ? 'Edit Package' : 'Create New Package'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Package Image</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-zinc-700">
                  <AvatarImage src={previewImage} alt="Package preview" />
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
                        // onChange={handleImageChange}
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

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Package Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter package title..."
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Group */}
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Academic Group</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectValue placeholder="Select academic group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {groupOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="text-zinc-300 hover:bg-zinc-800"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${option.bgColor}`} />
                            <span className={option.color}>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      placeholder="Enter package description..."
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 min-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Preview Card */}
            {(form.watch('title') || selectedGroup) && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Preview</Label>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2 border-zinc-700">
                        <AvatarImage src={previewImage} alt="Preview" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                          {form.watch('title')?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-zinc-100">
                          {form.watch('title') || 'Package Title'}
                        </h3>
                        {selectedGroupOption && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${selectedGroupOption.bgColor}`} />
                            <span className={`text-sm ${selectedGroupOption.color}`}>
                              {selectedGroupOption.label}
                            </span>
                          </div>
                        )}
                        {form.watch('description') && (
                          <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                            {form.watch('description')}
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