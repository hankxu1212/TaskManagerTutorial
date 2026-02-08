"use client";

import { Task as TaskType } from "@/state/api";
import BoardView from "@/components/BoardView";
import { FilterState, SortState } from "@/lib/filterTypes";

type Props = {
    sprintId: number;
    tasks: TaskType[];
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
    filterState: FilterState;
    sortState: SortState;
};

/**
 * Sprint BoardView wrapper component
 * Uses the shared BoardView component with sprint tasks
 * 
 * Validates: Requirements 5.4, 6.1, 6.2, 6.3, 6.4, 9.2
 */
const SprintBoardView = ({ sprintId: _sprintId, tasks, setIsModalNewTaskOpen, filterState, sortState }: Props) => {
    return (
        <BoardView
            tasks={tasks}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            filterState={filterState}
            sortState={sortState}
        />
    );
};

export default SprintBoardView;
