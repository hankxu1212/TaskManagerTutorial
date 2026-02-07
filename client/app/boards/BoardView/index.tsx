import { useState } from "react";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { Plus } from "lucide-react";
import type { DropTargetMonitor, DragSourceMonitor } from "react-dnd";
import TaskDetailModal from "@/components/TaskDetailModal";
import TaskCard from "@/components/TaskCard";
import { applyFilters } from "@/lib/filterUtils";
import { FilterState } from "@/lib/filterTypes";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  filterState: FilterState;
};

const taskStatus = ["Input Queue", "Work In Progress", "Review", "Done"];

const BoardView = ({ id, setIsModalNewTaskOpen, filterState }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Apply filters to tasks
  const filteredTasks = applyFilters(tasks ?? [], filterState);

  // Modal state management for task detail modal
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Derive selected task from fresh query data
  const selectedTask = tasks?.find((t) => t.id === selectedTaskId) || null;

  const handleTaskClick = (task: TaskType) => {
    setSelectedTaskId(task.id);
    setIsTaskDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskDetailModalOpen(false);
    setSelectedTaskId(null);
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
            tasks={filteredTasks}
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
        tasks={tasks || []}
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
    "Input Queue": "#7f97cb",
    "Work In Progress": "#65d6b3",
    "Review": "#d1ac1e",
    "Done": "#31aa00",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg py-2 px-2 xl:px-2 bg-gray-100 dark:bg-dark-secondary/50 ${isOver ? "bg-gray-200 dark:bg-dark-tertiary" : ""}`}
    >
      <div className="mb-3 flex w-full flex-col">
        <h3 className="flex items-center text-base font-semibold text-gray-700 dark:text-white">
          {status}{" "}
          <span
            className="ml-1.5 inline-block rounded-full bg-gray-200 px-1.5 py-0.5 text-center text-xs leading-none dark:bg-dark-tertiary"
          >
            {tasksCount}
          </span>
        </h3>
        <div className="mt-2 h-px bg-gray-300 dark:bg-stroke-dark" />
      </div>

      {status === "Input Queue" && (
        <button
          onClick={() => setIsModalNewTaskOpen(true)}
          className="mb-2 flex w-full items-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-white/50 p-3 text-gray-500 transition-colors hover:border-gray-400 hover:bg-white hover:text-gray-700 dark:border-stroke-dark dark:bg-dark-secondary/50 dark:text-neutral-500 dark:hover:border-neutral-500 dark:hover:bg-dark-secondary dark:hover:text-neutral-300"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200/70 dark:bg-dark-tertiary/70">
            <Plus size={14} />
          </span>
          <span className="text-sm font-medium">Create Task</span>
        </button>
      )}

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <DraggableTask key={task.id} task={task} onClick={onTaskClick} />
        ))}
    </div>
  );
};

type DraggableTaskProps = {
  task: TaskType;
  onClick?: (task: TaskType) => void;
};

const DraggableTask = ({ task, onClick }: DraggableTaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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
      className={`mb-2 ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <TaskCard task={task} onClick={handleClick} />
    </div>
  );
};

export default BoardView;
