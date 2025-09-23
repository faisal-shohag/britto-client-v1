import { useNavigate } from 'react-router';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Users,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { use } from "react";
import {FreeUserContext} from '@/context/FreeUser.context.tsx'
import { toast } from "sonner";

// Define Zod schema for form validation
const userSchema = z.object({
  name: z
    .string()
    .min(2, "তোমার নাম সঠিকভাবে দাও!")
    .max(50, "তোমার নাম সঠিকভাবে দাও!"),
  email: z.string().email("সঠিকভাবে ইমেইল অ্যাড্রেস দাও!").optional().or(z.literal("")),
  phone: z.string().min(1, "ফোন নম্বর দাও!").max(11, "সঠিক ফোন নম্বর দাও!"),
  address: z.string().optional().or(z.literal("")),
  college: z.string().min(2, 'কলেজের নাম দাও!'),
  group: z.enum(["SCIENCE", "HUMANITY", "COMMERCE", "ARTS", "NONE"], {
  required_error: "গ্রুপ সিলেক্ট করো!",
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "জেন্ডার সিলেক্ট করো!",
  }),
});

const Register = () => {
 const {setUser} = use(FreeUserContext)
 const navigate = useNavigate();


  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      college: "",
      group: "HUMANITY",
      gender: "MALE",
    },
  });

  // TanStack Query mutation for adding user
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
      // Filter out empty optional fields
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (
          value.trim() !== "" ||
          ["name", "phone", "group", "gender", "college"].includes(key)
        ) {
          acc[key] = value;
        }
        return acc;
      }, {});
      const response = await api.post("/freeUser/create", cleanedData);
      return response.data;
    },
    onSuccess: (data) => {
      form.reset(); // Reset form on successful submission
      form.setValue("group", "HUMANITY");
      form.setValue("gender", "MALE");
      form.setFocus("name"); 
      setUser(data.result)
      localStorage.setItem("user", JSON.stringify(data.result));
      navigate(location?.state?.from || "/free");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create user. Please try again.")
      console.error("Error creating user:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data) => {
    mutate(data);
  };

  const groupOptions = [
    { value: "SCIENCE", label: "Science" },
    { value: "HUMANITY", label: "Humanity" },
    { value: "COMMERCE", label: "Commerce" },
    { value: "ARTS", label: "Arts" },
    { value: "NONE", label: "None" },
  ];

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            রেজিস্ট্রেশন
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            তোমার ইনফরমেশন দিয়ে নিচের ফর্মটি পূরণ করো।
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {isError && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error?.response?.data?.message ||
                  "Failed to create user. Please try again."}
              </AlertDescription>
            </Alert>
          )}


          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name - Required */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        নাম *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full name"
                          disabled={isPending}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone - Required */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        ফোন নম্বর *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          disabled={isPending}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email - Optional */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        ইমেইল
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          disabled={isPending}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Group - Required */}
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        গ্রুপ *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full">
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          {groupOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="focus:bg-blue-50 dark:focus:bg-blue-900/50"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender - required */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        জেন্ডার *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          {genderOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="focus:bg-blue-50 dark:focus:bg-blue-900/50"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* College - Optional */}
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        কলেজ *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter college name"
                          disabled={isPending}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address - Optional */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        অ্যাড্রেস
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full address"
                          disabled={isPending}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating User...
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      সাবমিট
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
