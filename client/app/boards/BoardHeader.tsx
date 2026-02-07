"use client";

import { useState } from "react";
import {
  Filter,
  Settings,
  Table,
  X,
} from "lucide-react";
import { BiColumns } from "react-icons/bi";
import Link from "next/link";
import React from "react";
import { FilterState, DueDateOption } from "@/lib/filterTypes";
import { Tag, Priority } from "@/state/api";
import FilterDropdown from "@/components/FilterDropdown";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  boardName: string;
  boardDescription?: string;
  boardId: string;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  tags: Tag[];
  isFilterActive: boolean;
  totalTasks: number;
  totalPoints: number;
};

/**
 * BoardHeader component with filter support.
 * Validates: Requirements 1.1, 1.3, 6.1
 */
const BoardHeader = ({
  activeTab,
  setActiveTab,
  boardName,
  boardDescription,
  boardId,
  filterState,
  onFilterChange,
  tags,
  isFilterActive,
  totalTasks,
  totalPoints,
}: Props) => {
  // State for filter dropdown visibility
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Due date option labels
  const dueDateLabels: Record<DueDateOption, string> = {
    overdue: "Overdue",
    dueToday: "Due Today",
    dueThisWeek: "Due This Week",
    dueThisMonth: "Due This Month",
    noDueDate: "No Due Date",
  };

  // Remove a tag filter
  const removeTagFilter = (tagId: number) => {
    onFilterChange({
      ...filterState,
      selectedTagIds: filterState.selectedTagIds.filter((id) => id !== tagId),
    });
  };

  // Remove a priority filter
  const removePriorityFilter = (priority: Priority) => {
    onFilterChange({
      ...filterState,
      selectedPriorities: filterState.selectedPriorities.filter((p) => p !== priority),
    });
  };

  // Remove a due date filter
  const removeDueDateFilter = (option: DueDateOption) => {
    onFilterChange({
      ...filterState,
      selectedDueDateOptions: filterState.selectedDueDateOptions.filter((o) => o !== option),
    });
  };

  return (
    <div className="px-4 xl:px-6">
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold dark:text-white">
            {boardName}
          </h1>
          <span className="inline-block rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-700 dark:bg-dark-tertiary dark:text-white">
            {totalTasks} tasks · {totalPoints} pts
          </span>
          <Link
            href={`/boards/${boardId}/settings`}
            className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
        {boardDescription && (
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {boardDescription}
          </p>
        )}
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark">
        <div className="flex flex-1 items-end self-end gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<BiColumns className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Active filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
            {filterState.selectedTagIds.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <span
                  key={`tag-${tagId}`}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: tag.color || '#3b82f6' }}
                >
                  {tag.name}
                  <button
                    onClick={() => removeTagFilter(tagId)}
                    className="ml-0.5 hover:opacity-70"
                    aria-label={`Remove ${tag.name} filter`}
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
            {filterState.selectedPriorities.map((priority) => {
              const priorityColors: Record<Priority, string> = {
                [Priority.Urgent]: "#dc2626",
                [Priority.High]: "#ca8a04",
                [Priority.Medium]: "#16a34a",
                [Priority.Low]: "#2563eb",
                [Priority.Backlog]: "#6b7280",
              };
              return (
                <span
                  key={`priority-${priority}`}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: priorityColors[priority] }}
                >
                  {priority}
                  <button
                    onClick={() => removePriorityFilter(priority)}
                    className="ml-0.5 hover:opacity-70"
                    aria-label={`Remove ${priority} filter`}
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
            {filterState.selectedDueDateOptions.map((option) => (
              <span
                key={`duedate-${option}`}
                className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2.5 py-1 text-xs font-medium text-white"
              >
                {dueDateLabels[option]}
                <button
                  onClick={() => removeDueDateFilter(option)}
                  className="ml-0.5 hover:opacity-70"
                  aria-label={`Remove ${dueDateLabels[option]} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          
          {/* Filter button with dropdown - Validates: Requirements 1.1, 1.3, 6.1 */}
          <div className="relative">
            <button
              className="relative text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              aria-label="Toggle filter dropdown"
              aria-expanded={isFilterDropdownOpen}
            >
              <Filter className="h-5 w-5" />
              {/* Visual indicator when filters are active - Validates: Requirement 6.1 */}
              {isFilterActive && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
              )}
            </button>
            {/* Filter dropdown - Validates: Requirements 1.1, 1.2, 1.3, 1.4 */}
            <FilterDropdown
              isOpen={isFilterDropdownOpen}
              onClose={() => setIsFilterDropdownOpen(false)}
              filterState={filterState}
              onFilterChange={onFilterChange}
              tags={tags}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 
      after:absolute after:-bottom-2.25 after:left-0 after:h-px after:w-full 
      hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white 
      sm:px-2 lg:px-4 ${
        isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default BoardHeader;
