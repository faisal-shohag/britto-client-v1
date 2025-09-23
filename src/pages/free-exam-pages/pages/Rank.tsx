import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { FaCrown, FaTrophy, FaMedal  } from "react-icons/fa6";
// Shadcn UI imports
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '../components/Splash';
import { FreeUserContext } from '@/context/FreeUser.context';



// Custom hooks for API calls
const useGlobalLeaderboard = (page = 1, limit = 30, group = '') => {
  return useQuery({
    queryKey: ['globalLeaderboard', page, limit, group],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(group && { group })
      });
      
      const response = await api.get(`/freeExam/global-leaderboard?${params}`);
      return response.data.data;
    },
    // keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useMyRank = (userId) => {
  return useQuery({
    queryKey: ['myRankStates'],
    queryFn: async () => {
      try {
        const response = await api.get(`/freeExam/users/${userId}/rank-stats`);
      return response.data.data;
      } catch (error) {
        console.log(error)
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};




// const useLeaderboardStats = () => {
//   return useQuery({
//     queryKey: ['leaderboardStats'],
//     queryFn: async () => {
//       const response = await api.get('/freeExam/leaderboard-stats');
//       return response.data;
//     },
//     staleTime: 10 * 60 * 1000, // 10 minutes
//   });
// };

// const useTopPerformers = (limit = 3, group = '') => {
//   return useQuery({
//     queryKey: ['topPerformers', limit, group],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         limit: limit.toString(),
//         ...(group && { group })
//       });
      
//       const response = await api.get(`/freeExam/top-performers?${params}`);
//       return response.data;
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };

const Rank = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {user} = use(FreeUserContext) as any
//   const [selectedGroup, setSelectedGroup] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

  const {
    data: leaderboardData,
    isLoading,
    error,
    isFetching
  } = useGlobalLeaderboard(currentPage, 30);

  const {data:myRank, isLoading:myRankLoading} = useMyRank(user.id)
//   const { data: statsData } = useLeaderboardStats();
//   const { data: topPerformersData } = useTopPerformers(3, selectedGroup);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <FaTrophy className="w-6 h-6 text-orange-400" />;
      case 3:
        return <FaMedal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-sm font-bold">{rank}</span>
          </div>
        );
    }
  };

  const getRankCardClass = (rank) => {
    switch (rank) {
      case 1:
        return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 dark:from-zinc-800 dark:to-zinc-900 to-amber-50  ';
      case 2:
        return 'border-l-4 border-l-red-400 bg-gradient-to-r from-red-50  to-pink-50  dark:from-zinc-800 dark:to-zinc-900 ';
      case 3:
        return 'border-l-4 border-l-amber-600 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-900 ';
      default:
        return 'border-l-4 border-l-transparent hover:border-l-blue-200 hover:bg-blue-50/30 transition-colors';
    }
  };

  // const getGroupBadgeVariant = (group) => {
  //   switch (group) {
  //     case 'SCIENCE':
  //       return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  //     case 'COMMERCE':
  //       return 'bg-green-100 text-green-800 hover:bg-green-200';
  //     case 'ARTS':
  //       return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  //   }
  // };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

//   const handleGroupChange = (group) => {
//     setSelectedGroup(group === 'all' ? '' : group);
//     setCurrentPage(1);
//   };


// console.log(leaderboardData)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <TrendingUp className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Failed to load leaderboard data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

// console.log(leaderboardData)

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Global Leaderboard
            </CardTitle>
            <p className="text-gray-600">
              Top performers across all exams and categories
            </p>
          </CardHeader>
        </Card> */}

        {/* Stats Overview */}
        {/* {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-xl font-bold">{statsData.totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-xl font-bold">{(statsData.averageScore || 0).toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-gray-600">Highest Score</p>
                  <p className="text-xl font-bold text-green-600">{statsData.highestMarks || 0}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                  <p className="text-xl font-bold text-purple-600">
                    {(statsData.averageAccuracy || 0).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

        {/* Top 3 Performers Spotlight */}
        {/* {topPerformersData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPerformersData.slice(0, 3).map((performer, index) => (
                  <div key={performer.id} className="text-center p-4 rounded-lg bg-gradient-to-b from-gray-50 to-white border">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={performer.user.picture} />
                      <AvatarFallback className="text-lg">
                        {getInitials(performer.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">{performer.user.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{performer.user.college}</p>
                    <Badge className={getGroupBadgeVariant(performer.user.group)}>
                      {performer.user.group}
                    </Badge>
                    <div className="mt-3 space-y-1">
                      <p className="text-2xl font-bold text-blue-600">{performer.totalMarks}</p>
                      <p className="text-xs text-gray-500">Total Marks</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Filters */}
        {/* <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or college..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Select value={selectedGroup || 'all'} onValueChange={handleGroupChange}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="SCIENCE">Science</SelectItem>
                    <SelectItem value="COMMERCE">Commerce</SelectItem>
                    <SelectItem value="ARTS">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className='text-center text-lg'>Ranks</CardTitle>
            <div className='text-center border-b justify-center border-dashed pb-2 text-sm flex items-center gap-2'>তোমার বর্তমান অবস্থান: {myRankLoading ? <Spinner/> : myRank?.rank} </div>
          </CardHeader>
          <CardContent className="p-0">
            {(isLoading || myRankLoading) ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-12 h-8" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {leaderboardData?.leaderboard?.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-4 ${entry.user.id === user.id ? 'bg-gradient-to-r from-pink-600 to-red-500 text-white': getRankCardClass(entry.rank)} $ transition-all duration-200`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-5 text-center">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className="w-7 h-7 text-xs">
                        <AvatarImage src={entry.user.picture} />
                        <AvatarFallback className='text-black dark:text-white'>
                          {getInitials(entry.user.name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {entry.user.name}
                        </h3>
                        <p className="text-xs  truncate">
                          {entry.user.college}
                        </p>
                      </div>

                      {/* Group Badge */}
                      {/* <Badge className={getGroupBadgeVariant(entry.user.group)}>
                        {entry.user.group}
                      </Badge> */}

                      {/* Stats */}
                      <div className="hidden md:block text-right">
                        <div className="text-sm text-gray-600">Accuracy</div>
                        <div className="font-semibold">
                          {entry.accuracyPercentage?.toFixed(1)}%
                        </div>
                      </div>

                      {/* <div className="text-right">
                        <div className="text-sm text-gray-600">Exams</div>
                        <div className="font-semibold">{entry.totalExamsCompleted}</div>
                      </div> */}

                      {/* Total Score */}
                      <div className="text-right min-w-0">
                        <div className={`text-lg font-bold text-blue-600 ${entry.user.id === user.id ? 'text-white':'text-blue-600'}`}>
                          {entry.totalMarks}
                        </div>
                        <div className={`text-xs ${entry.user.id === user.id ? 'text-white':'text-gray-500'}`}>Total Marks</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {leaderboardData && leaderboardData.totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                    <p className="text-sm text-gray-600">
                      Showing page {leaderboardData.page} of {leaderboardData.totalPages} 
                      ({leaderboardData.total} total entries)
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || isFetching}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                        {currentPage}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= leaderboardData.totalPages || isFetching}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Loading Indicator */}
        {isFetching && !isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <Spinner/>
              Updating leaderboard...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rank;