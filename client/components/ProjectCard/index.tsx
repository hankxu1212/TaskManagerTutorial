import { Project } from "@/state/api";
import { Briefcase } from "lucide-react";
import Link from "next/link";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <Link href={`/boards/${project.id}`}>
      <div className="cursor-pointer rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md dark:bg-dark-secondary">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-tertiary">
            <Briefcase className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h3>
        </div>

        {project.description && (
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-neutral-400">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
