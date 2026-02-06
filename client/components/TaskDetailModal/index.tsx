import Modal from "../Modal";
import { Task } from "@/state/api";
import { format } from "date-fns";
import { Calendar, MessageSquareMore, User, Users, Tag, Award } from "lucide-react";
import Image from "next/image";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

// Priority tag component matching BoardView styling
const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
  <div
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      priority === "Urgent"
        ? "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200"
        : priority === "High"
          ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
          : priority === "Medium"
            ? "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200"
            : priority === "Low"
              ? "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
    }`}
  >
    {priority}
  </div>
);

// Status badge component with color-coded styling
const StatusBadge = ({ status }: { status: Task["status"] }) => {
  const statusColor: Record<string, string> = {
    "To Do": "bg-[#7f97cb] text-white",
    "Work In Progress": "bg-[#65d6b3] text-white",
    "Under Review": "bg-[#d1ac1e] text-white",
    Completed: "bg-[#31aa00] text-white",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        statusColor[status || ""] || "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

const TaskDetailModal = ({ isOpen, onClose, task }: TaskDetailModalProps) => {
  // Guard against null task
  if (!task) return null;

  // Parse tags
  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  // Format dates
  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "PPP")
    : "Not set";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "PPP")
    : "Not set";

  // Comment count
  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={task.title}>
      <div className="mt-4 space-y-6 dark:text-white">
        {/* Header Section - Title and Priority */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task.title}
          </h2>
          {task.priority && <PriorityTag priority={task.priority} />}
        </div>

        {/* Description Section */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Description
          </h3>
          <p className="text-gray-600 dark:text-neutral-400">
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Metadata Section - Status, Tags, Dates, Points */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Status */}
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
            <span className="text-sm text-gray-600 dark:text-neutral-400">Status:</span>
            {task.status && <StatusBadge status={task.status} />}
          </div>

          {/* Points */}
          {typeof task.points === "number" && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
              <span className="text-sm text-gray-600 dark:text-neutral-400">Points:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {task.points} pts
              </span>
            </div>
          )}

          {/* Start Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
            <span className="text-sm text-gray-600 dark:text-neutral-400">Start Date:</span>
            <span className="text-sm text-gray-900 dark:text-white">{formattedStartDate}</span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
            <span className="text-sm text-gray-600 dark:text-neutral-400">Due Date:</span>
            <span className="text-sm text-gray-900 dark:text-white">{formattedDueDate}</span>
          </div>
        </div>

        {/* Tags Section */}
        {taskTagsSplit.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {taskTagsSplit.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* People Section - Author and Assignee */}
        <div className="border-t border-gray-200 pt-4 dark:border-stroke-dark">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Author */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Author
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {task.author?.profilePictureUrl ? (
                  <Image
                    src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${task.author.profilePictureUrl}`}
                    alt={task.author.username}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-dark-tertiary">
                    <User className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
                  </div>
                )}
                <span className="text-sm text-gray-900 dark:text-white">
                  {task.author?.username || "Unknown"}
                </span>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Assignee
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {task.assignee?.profilePictureUrl ? (
                  <Image
                    src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${task.assignee.profilePictureUrl}`}
                    alt={task.assignee.username}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-dark-tertiary">
                    <Users className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
                  </div>
                )}
                <span className="text-sm text-gray-900 dark:text-white">
                  {task.assignee?.username || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Section - Conditional Rendering */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="border-t border-gray-200 pt-4 dark:border-stroke-dark">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Attachments ({task.attachments.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {task.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="overflow-hidden rounded-lg border border-gray-200 dark:border-stroke-dark"
                >
                  <Image
                    src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${attachment.fileURL}`}
                    alt={attachment.fileName}
                    width={400}
                    height={200}
                    className="h-auto w-full object-cover"
                  />
                  <div className="bg-gray-50 px-3 py-2 dark:bg-dark-tertiary">
                    <p className="truncate text-xs text-gray-600 dark:text-neutral-400">
                      {attachment.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Count Display */}
        <div className="flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-stroke-dark">
          <MessageSquareMore className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
          <span className="text-sm text-gray-600 dark:text-neutral-400">
            {numberOfComments} {numberOfComments === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
