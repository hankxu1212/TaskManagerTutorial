"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Filter,
  Settings,
  Table,
  X,
} from "lucide-react";
import { BiColumns } from "react-icons/bi";
import Link from "next/link";
import React from "react";
import { FilterState, DueDateOption, SortState, SortField } from "@/lib/filterTypes";
import { PRIORITY_COLORS } from "@/lib/priorityColors";
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
  sortState: SortState;
  onSortChange: (newState: SortState) => void;
  isSortActive: boolean;
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
  sortState,
  onSortChange,
  isSortActive,
}: Props) => {
  // State for filter dropdown visibility
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Sort field labels
  const sortFieldLabels: Record<SortField, string> = {
    none: "None",
    dueDate: "Due Date",
    priority: "Priority",
    points: "Points",
  };

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
              return (
                <span
                  key={`priority-${priority}`}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: PRIORITY_COLORS[priority] }}
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
          
          {/* Sort button with dropdown */}
          <div className="relative">
            <button
              className="relative text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              aria-label="Toggle sort dropdown"
              aria-expanded={isSortDropdownOpen}
            >
              <ArrowUpDown className="h-5 w-5" />
              {isSortActive && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
              )}
            </button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-dark-tertiary dark:bg-dark-secondary">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                  Sort by
                </div>
                {(["dueDate", "priority", "points"] as SortField[]).map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      if (sortState.field === field) {
                        // Toggle direction or clear
                        if (sortState.direction === "asc") {
                          onSortChange({ field, direction: "desc" });
                        } else {
                          onSortChange({ field: "none", direction: "asc" });
                        }
                      } else {
                        onSortChange({ field, direction: "asc" });
                      }
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-dark-tertiary ${
                      sortState.field === field ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <span>{sortFieldLabels[field]}</span>
                    {sortState.field === field && (
                      <span className="text-xs">
                        {sortState.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                ))}
                {isSortActive && (
                  <>
                    <div className="my-1 border-t border-gray-200 dark:border-dark-tertiary" />
                    <button
                      onClick={() => onSortChange({ field: "none", direction: "asc" })}
                      className="flex w-full items-center px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-dark-tertiary"
                    >
                      Clear sort
                    </button>
                  </>
                )}
              </div>
            )}
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
      hover:text-gray-700 dark:text-neutral-500 dark:hover:text-white 
      sm:px-2 lg:px-4 ${
        isActive ? "text-gray-700 dark:text-white" : ""
      }`}
      style={isActive ? { ["--tw-after-bg" as string]: "rgb(244, 215, 125)" } : undefined}
      onClick={() => setActiveTab(name)}
    >
      {isActive && (
        <span 
          className="absolute -bottom-2.25 left-0 h-px w-full" 
          style={{ backgroundColor: "rgb(244, 215, 125)" }}
        />
      )}
      {icon}
      {name}
    </button>
  );
};

export default BoardHeader;
