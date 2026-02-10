"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  Status,
  useGetTasksAssignedToUserQuery,
  useGetPointsAnalyticsQuery,
} from "@/state/api";
import { useAuthUser } from "@/lib/useAuthUser";
import { ClipboardList } from "lucide-react";
import PointsGraph from "@/components/PointsGraph";
import { format, subMonths } from "date-fns";

type GroupBy = "week" | "month" | "year";

const DashboardPage = () => {
  // Default to last 3 months, grouped by week
  const [groupBy, setGroupBy] = useState<GroupBy>("week");
  const [startDate, setStartDate] = useState(() =>
    format(subMonths(new Date(), 3), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );

  const { data: authData, isLoading: authLoading, isFetching: authFetching } = useAuthUser();
  const userId = authData?.userDetails?.userId;

  const { data: assignedTasks, isLoading: tasksLoading, isFetching: tasksFetching, refetch: refetchTasks } =
    useGetTasksAssignedToUserQuery(userId!, { 
      skip: !userId,
    });

  const { data: pointsData, isLoading: pointsLoading, isFetching: pointsFetching, refetch: refetchPoints } =
    useGetPointsAnalyticsQuery(
      { userId: userId!, groupBy, startDate, endDate },
      { 
        skip: !userId,
      },
    );

  // Refetch data when userId changes (e.g., when impersonation changes)
  useEffect(() => {
    if (userId) {
      refetchTasks();
      refetchPoints();
    }
  }, [userId, refetchTasks, refetchPoints]);

  const handleGroupByChange = (newGroupBy: GroupBy) => {
    setGroupBy(newGroupBy);
  };

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Calculate open tasks count (status 0, 1, 2 - not Done)
  const openTasksCount =
    assignedTasks?.filter((task) => task.status !== Status.Done).length ?? 0;

  const isLoading = authLoading || authFetching || tasksLoading || tasksFetching;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500 dark:text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header name="Dashboard" />

      {/* Stats Card - Open Tasks */}
      <div className="mb-8">
        <div className="dark:bg-dark-secondary rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {openTasksCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Open Tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Points Graph */}
      <PointsGraph
        data={pointsData ?? []}
        groupBy={groupBy}
        startDate={startDate}
        endDate={endDate}
        onGroupByChange={handleGroupByChange}
        onDateRangeChange={handleDateRangeChange}
        isLoading={pointsLoading || pointsFetching}
      />
    </div>
  );
};

export default DashboardPage;
