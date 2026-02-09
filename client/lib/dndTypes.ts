// Shared drag-and-drop item types
export const DND_ITEM_TYPES = {
  TASK: "task",
} as const;

export interface DraggedTask {
  id: number;
  projectId: number;
}
