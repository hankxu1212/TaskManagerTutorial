import { useState } from "react";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import type { DropTargetMonitor, DragSourceMonitor } from "react-dnd";
import TaskDetailModal from "@/components/TaskDetailModal";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Modal state management for task detail modal
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const handleTaskClick = (task: TaskType) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskDetailModalOpen(false);
    setSelectedTask(null);
  };

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>
      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  onTaskClick: (task: TaskType) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  onTaskClick,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: Record<string, string> = {
    "To Do": "#7f97cb",
    "Work In Progress": "#65d6b3",
    "Under Review": "#d1ac1e",
    Completed: "#31aa00",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg py-1 xl:px-1 ${isOver ? "bg-gray-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-2 flex w-full">
        <div
          className={`w-1.5 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-3 py-2 dark:bg-dark-secondary">
          <h3 className="flex items-center text-sm font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-1.5 inline-block rounded-full bg-gray-200 px-1.5 py-0.5 text-center text-xs leading-none dark:bg-dark-tertiary"
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-5 w-4 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={18} />
            </button>
            <button
              className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} onClick={onTaskClick} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
  onClick?: (task: TaskType) => void;
};

const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      priority === "Urgent"
        ? "bg-red-200 text-red-700"
        : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
            ? "bg-green-200 text-green-700"
            : priority === "Low"
              ? "bg-blue-200 text-blue-700"
              : "bg-gray-200 text-gray-700"
    }`}
  >
    {priority}
  </div>
);

const Task = ({ task, onClick }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick(task);
    }
  };

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-2 rounded-md bg-white shadow dark:bg-dark-secondary cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      onClick={handleClick}
    >
      <div className="p-2 md:p-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-1">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-dark-tertiary"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="my-1.5 flex justify-between">
          <h4 className="text-sm font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <div className="mt-2 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex -space-x-1 overflow-hidden">
            {task.assignee && (
              <Image
                key={`assignee-${task.assignee.userId}`}
                src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                key={`author-${task.author.userId}`}
                src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>
          {numberOfComments > 0 && (
            <div className="flex items-center text-gray-500 dark:text-neutral-500">
              <MessageSquareMore size={16} />
              <span className="ml-1 text-xs dark:text-neutral-400">
                {numberOfComments}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardView;
