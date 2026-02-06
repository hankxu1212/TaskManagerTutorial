"use client";

import { useState, use } from "react";
import BoardHeader from "@/app/boards/BoardHeader";
import Board from "../BoardView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";
import { useGetProjectsQuery } from "@/state/api";

type Props = {
    params: Promise<{ id: string }>;
};

const BoardPage = ({ params }: Props) => {
    const { id } = use(params);
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    
    const { data: projects } = useGetProjectsQuery();
    const project = projects?.find((p) => p.id === Number(id));

    return (
        <div>
            <ModalNewTask
                isOpen={isModalNewTaskOpen}
                onClose={() => setIsModalNewTaskOpen(false)}
                id={id}
            />
            <BoardHeader 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                boardName={project?.name || "Board"}
                boardId={id}
            />
            {activeTab === "Board" && (
                <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
            {activeTab === "Table" && (
                <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
        </div>
    );
};

export default BoardPage;
