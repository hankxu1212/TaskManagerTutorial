"use client";

import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import { Task, Status, useGetAuthUserQuery, useGetTasksByUserQuery } from "@/state/api";
import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const HomePage = () => {
  const { data: authData, isLoading: authLoading } = useGetAuthUserQuery({});
  const userId = authData?.userDetails?.userId;

  const { data: tasks, isLoading: tasksLoading } = useGetTasksByUserQuery(
    userId!,
    { skip: !userId }
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Filter for open tasks (not Done)
  const openTasks = tasks?.filter((task) => task.status !== Status.Done) || [];

  // Group by status
  const todoTasks = openTasks.filter((t) => t.status === Status.InputQueue);
  const wipTasks = openTasks.filter((t) => t.status === Status.WorkInProgress);
  const reviewTasks = openTasks.filter((t) => t.status === Status.Review);

  const isLoading = authLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500 dark:text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header name="Overview" />

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2 dark:bg-dark-tertiary">
              <Clock className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {todoTasks.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">To Do</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {wipTasks.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                In Progress
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {reviewTasks.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Under Review
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Open Tasks */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          My Open Tasks ({openTasks.length})
        </h2>

        {openTasks.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-dark-secondary">
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-500" />
            <p className="text-gray-600 dark:text-neutral-300">
              You&apos;re all caught up! No open tasks assigned to you.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        tasks={openTasks}
      />
    </div>
  );
};

export default HomePage;
