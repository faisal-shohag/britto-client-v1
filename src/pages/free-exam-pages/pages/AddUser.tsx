import { useState } from 'react';
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Mail, Phone, MapPin, GraduationCap, Users, Lock, Image } from "lucide-react";

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        picture: '',
        address: '',
        college: '',
        group: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const groupOptions = [
        { value: 'SCIENCE', label: 'Science' },
        { value: 'HUMANITY', label: 'Humanity' },
        { value: 'COMMERCE', label: 'Commerce' },
        { value: 'ARTS', label: 'Arts' },
        { value: 'NONE', label: 'None' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({
            ...prev,
            group: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMessage({ type: 'error', content: 'Name is required' });
            return false;
        }
        if (!formData.phone.trim()) {
            setMessage({ type: 'error', content: 'Phone is required' });
            return false;
        }
        if (!formData.group) {
            setMessage({ type: 'error', content: 'Group is required' });
            return false;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            setMessage({ type: 'error', content: 'Invalid email format' });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setMessage({ type: '', content: '' });

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Filter out empty optional fields
            const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value.trim() !== '' || ['name', 'phone', 'group'].includes(key)) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await api.post('/freeUser/create', cleanedData);
            console.log(response)
            
            setMessage({ 
                type: 'success', 
                content: 'User created successfully!' 
            });
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                picture: '',
                address: '',
                college: '',
                group: ''
            });
        } catch (error:any) {
            setMessage({ 
                type: 'error', 
                content: error.response?.data?.message || 'Failed to create user. Please try again.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="space-y-2 text-center pb-8">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add New User
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a new user account with their details
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {message.content && (
                        <Alert className={`${
                            message.type === 'success' 
                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                                : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                        }`}>
                            <AlertDescription className={`${
                                message.type === 'success' 
                                    ? 'text-green-800 dark:text-green-200' 
                                    : 'text-red-800 dark:text-red-200'
                            }`}>
                                {message.content}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name - Required */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Name *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            {/* Phone - Required */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Phone *
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                            {/* Email - Optional */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Enter email address"
                                />
                            </div>

                            {/* Password - Optional */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        {/* Group - Required */}
                        <div className="space-y-2">
                            <Label htmlFor="group" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Group *
                            </Label>
                            <Select onValueChange={handleSelectChange} value={formData.group}>
                                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                                    <SelectValue placeholder="Select a group" />
                                </SelectTrigger>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* College - Optional */}
                            <div className="space-y-2">
                                <Label htmlFor="college" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    College
                                </Label>
                                <Input
                                    id="college"
                                    name="college"
                                    type="text"
                                    value={formData.college}
                                    onChange={handleInputChange}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Enter college name"
                                />
                            </div>

                            {/* Picture URL - Optional */}
                            <div className="space-y-2">
                                <Label htmlFor="picture" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Image className="w-4 h-4" />
                                    Picture URL
                                </Label>
                                <Input
                                    id="picture"
                                    name="picture"
                                    type="url"
                                    value={formData.picture}
                                    onChange={handleInputChange}
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    placeholder="Enter picture URL"
                                />
                            </div>
                        </div>

                        {/* Address - Optional */}
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Address
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="Enter full address"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating User...
                                    </>
                                ) : (
                                    <>
                                        <User className="mr-2 h-4 w-4" />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddUser;