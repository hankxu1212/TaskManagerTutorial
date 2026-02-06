"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import UserCard from "@/components/UserCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import TaskCard from "@/components/TaskCard";
import { Task, useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const hasResults =
    searchResults &&
    ((searchResults.tasks && searchResults.tasks.length > 0) ||
      (searchResults.projects && searchResults.projects.length > 0) ||
      (searchResults.users && searchResults.users.length > 0));

  const noResults = searchTerm.length >= 3 && !isLoading && !hasResults;

  return (
    <div className="p-8">
      <Header name="Search" />

      {/* Search Input */}
      <div className="relative mb-6 max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks, projects, or users..."
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 shadow-sm transition-colors focus:border-gray-400 focus:outline-none dark:border-dark-tertiary dark:bg-dark-secondary dark:text-white dark:placeholder-neutral-400"
          onChange={handleSearch}
        />
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            Type at least 3 characters to search
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-neutral-400">Searching...</div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Error occurred while fetching search results. Please try again.
        </div>
      )}

      {/* No Results */}
      {noResults && (
        <div className="py-12 text-center text-gray-500 dark:text-neutral-400">
          No results found for "{searchTerm}"
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && hasResults && (
        <div className="space-y-8">
          {/* Tasks Section */}
          {searchResults.tasks && searchResults.tasks.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Tasks ({searchResults.tasks.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {searchResults.projects && searchResults.projects.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Projects ({searchResults.projects.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {/* Users Section */}
          {searchResults.users && searchResults.users.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Users ({searchResults.users.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.users.map((user) => (
                  <UserCard key={user.userId} user={user} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </div>
  );
};

export default Search;
