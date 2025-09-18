import { useState, useEffect } from 'react';
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Users, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    GraduationCap, 
    Calendar,
    Search,
    // Filter,
    RefreshCw,
    UserCheck,
    AlertCircle,
    Eye
} from "lucide-react";

// Define interfaces for type safety
interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    college?: string;
    address?: string;
    group: string;
    picture?: string;
    createdAt: string;
    updatedAt?: string;
}

// interface GroupOption {
//     value: string;
//     label: string;
// }

interface ApiResponse {
    data: User[] | { users: User[]; total?: number };
}

const AllUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    // const [filterGroup, setFilterGroup] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // const groupOptions: GroupOption[] = [
    //     { value: '', label: 'All Groups' },
    //     { value: 'SCIENCE', label: 'Science' },
    //     { value: 'HUMANITY', label: 'Humanity' },
    //     { value: 'COMMERCE', label: 'Commerce' },
    //     { value: 'ARTS', label: 'Arts' },
    //     { value: 'NONE', label: 'None' }
    // ];

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.get<ApiResponse>('/freeUser/all');
            const userData:any = response.data;
            // console.log(userData)

            setUsers(userData.result);
                setTotalCount(userData.result.length);
        
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            setUsers([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm) ||
                user.college?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // if (filterGroup) {
        //     filtered = filtered.filter(user => user.group === filterGroup);
        // }

        setFilteredUsers(filtered);
    }, [users, searchTerm,]);

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getGroupBadgeColor = (group: string): string => {
        const colors: { [key: string]: string } = {
            SCIENCE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            HUMANITY: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            COMMERCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            ARTS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            NONE: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
        };
        return colors[group] || colors.NONE;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading users...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Users</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage and view all registered users
                        </p>
                    </div>
                </div>

                {/* Stats Card */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</p>
                                </div>
                                <Button
                                    onClick={fetchUsers}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 dark:border-gray-600"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search by name, email, phone, or college..."
                                        value={searchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>
                            {/* <div className="w-full md:w-48">
                                <Select value={filterGroup} onValueChange={setFilterGroup}>
                                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Filter by group" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                        {groupOptions.map((option: GroupOption) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Error Message */}
                {error && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Users Grid */}
                {filteredUsers.length === 0 ? (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Users Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {users.length === 0 ? 'No users have been registered yet.' : 'No users match your search criteria.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user: User) => (
                            <Card 
                                key={user.id} 
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                                onClick={() => setSelectedUser(user)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                {user.picture ? (
                                                    <img 
                                                        src={user.picture} 
                                                        alt={user.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            if (target.nextSibling) {
                                                                (target.nextSibling as HTMLElement).style.display = 'flex';
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                <User className="w-6 h-6 text-white" style={{display: user.picture ? 'none' : 'block'}} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {user.name}
                                                </CardTitle>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getGroupBadgeColor(user.group)}`}>
                                                    {user.group}
                                                </span>
                                            </div>
                                        </div>
                                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    {user.email && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Phone className="w-4 h-4" />
                                        <span>{user.phone}</span>
                                    </div>
                                    
                                    {user.college && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <GraduationCap className="w-4 h-4" />
                                            <span className="truncate">{user.college}</span>
                                        </div>
                                    )}
                                    
                                    {user.address && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{user.address}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <Calendar className="w-3 h-3" />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* User Detail Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <Card className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        User Details
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedUser(null)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        {selectedUser.picture ? (
                                            <img 
                                                src={selectedUser.picture} 
                                                alt={selectedUser.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    if (target.nextSibling) {
                                                        (target.nextSibling as HTMLElement).style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <User className="w-8 h-8 text-white" style={{display: selectedUser.picture ? 'none' : 'block'}} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {selectedUser.name}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGroupBadgeColor(selectedUser.group)}`}>
                                            {selectedUser.group}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Contact Information</h4>
                                        
                                        {selectedUser.email && (
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-300">{selectedUser.email}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-300">{selectedUser.phone}</span>
                                        </div>
                                        
                                        {selectedUser.address && (
                                            <div className="flex items-start space-x-3">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <span className="text-gray-600 dark:text-gray-300">{selectedUser.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Additional Information</h4>
                                        
                                        {selectedUser.college && (
                                            <div className="flex items-center space-x-3">
                                                <GraduationCap className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-300">{selectedUser.college}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-300">Joined: {formatDate(selectedUser.createdAt)}</p>
                                                <p className="text-gray-600 dark:text-gray-300">Updated: {formatDate(selectedUser.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        User ID: {selectedUser.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;