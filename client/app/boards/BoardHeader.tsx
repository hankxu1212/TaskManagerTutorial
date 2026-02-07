"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
  Filter,
  Grid3x3,
  Settings,
  Share2,
  Table,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { FilterState } from "@/lib/filterTypes";
import { Tag } from "@/state/api";
import FilterDropdown from "@/components/FilterDropdown";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  boardName: string;
  boardId: string;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  tags: Tag[];
  isFilterActive: boolean;
};

/**
 * BoardHeader component with filter support.
 * Validates: Requirements 1.1, 1.3, 6.1
 */
const BoardHeader = ({
  activeTab,
  setActiveTab,
  boardName,
  boardId,
  filterState,
  onFilterChange,
  tags,
  isFilterActive,
}: Props) => {
  // State for filter dropdown visibility
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  return (
    <div className="px-4 xl:px-6">
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name={boardName}
          buttonComponent={
            <Link
              href={`/boards/${boardId}/settings`}
              className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-100 dark:border-stroke-dark dark:text-neutral-300 dark:hover:bg-dark-tertiary"
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          }
        />
      </div>

      {/* TABS */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
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
