import { Task } from "@/state/api";
import RadialProgress from "@/components/RadialProgress";
import { format } from "date-fns";
import { MessageSquareMore } from "lucide-react";
import Image from "next/image";

type Props = {
  task: Task;
  onClick?: () => void;
  className?: string;
};

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Get averaged color from task tags
const getAverageTagColor = (task: Task): string | null => {
  const colors = task.taskTags
    ?.map((tt) => tt.tag.color)
    .filter((c): c is string => !!c)
    .map(hexToRgb)
    .filter((c): c is { r: number; g: number; b: number } => c !== null);

  if (!colors || colors.length === 0) return null;

  const avg = {
    r: Math.round(colors.reduce((sum, c) => sum + c.r, 0) / colors.length),
    g: Math.round(colors.reduce((sum, c) => sum + c.g, 0) / colors.length),
    b: Math.round(colors.reduce((sum, c) => sum + c.b, 0) / colors.length),
  };

  return `rgba(${avg.r}, ${avg.g}, ${avg.b}, 0.15)`;
};

const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      priority === "Urgent"
        ? "bg-red-200 text-red-700"
        : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
            ? "bg-green-200 text-green-700"
            : priority === "Low"
              ? "bg-gray-300 text-gray-700"
              : "bg-gray-200 text-gray-700"
    }`}
  >
    {priority}
  </div>
);

const TaskCard = ({ task, onClick, className = "" }: Props) => {
  const tags = task.taskTags?.map((tt) => tt.tag) || [];
  const avgColor = getAverageTagColor(task);

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const subtasks = task.subtasks ?? [];
  const totalCount = subtasks.length;
  const completedCount = subtasks.filter(
    (s) => s.status === "Completed",
  ).length;

  return (
    <div
      onClick={onClick}
      className={`rounded-md bg-white shadow dark:bg-dark-secondary ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={avgColor ? { backgroundColor: avgColor } : undefined}
    >
      <div className="p-2 md:p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold dark:text-white">{task.title}</h4>
            {task.priority && <PriorityTag priority={task.priority} />}
          </div>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="rounded-full px-1.5 py-0.5 text-xs"
                style={{
                  backgroundColor: tag.color ? `${tag.color}30` : undefined,
                  color: tag.color || undefined,
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}

        {formattedDueDate && (
          <div className="mt-1.5 text-xs text-gray-500 dark:text-neutral-500">
            DueDate: {formattedDueDate}
          </div>
        )}
        <div className="mt-2 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex -space-x-1 overflow-hidden">
            {task.assignee && task.assignee.profilePictureUrl && (
              <Image
                key={`assignee-${task.assignee.userId}`}
                src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && task.author.profilePictureUrl && (
              <Image
                key={`author-${task.author.userId}`}
                src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${task.author.profilePictureUrl}`}
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
          {totalCount > 0 && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-neutral-500">
              <RadialProgress completed={completedCount} total={totalCount} />
              <span className="text-xs dark:text-neutral-400">
                {completedCount}/{totalCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
