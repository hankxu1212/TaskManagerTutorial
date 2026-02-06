import { useState } from "react";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, Plus } from "lucide-react";
import type { DropTargetMonitor, DragSourceMonitor } from "react-dnd";
import TaskDetailModal from "@/components/TaskDetailModal";
import TaskCard from "@/components/TaskCard";

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
