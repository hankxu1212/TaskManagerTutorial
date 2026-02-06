"use client";

import Header from "@/components/Header";
import {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  Tag,
} from "@/state/api";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

const TagsPage = () => {
  const { data: tags, isLoading } = useGetTagsQuery();
  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    await createTag({ name: newTagName.trim() });
    setNewTagName("");
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim() || editingId === null) return;
    await updateTag({ tagId: editingId, name: editingName.trim() });
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (tagId: number, tagName: string) => {
    if (!confirm(`Delete tag "${tagName}"?`)) return;
    await deleteTag(tagId);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <Header name="Tags" />

      {/* Create new tag */}
      <div className="mb-6 mt-4 flex max-w-md items-center gap-2">
        <input
          type="text"
          placeholder="New tag name..."
          className="flex-1 rounded border border-gray-300 p-2 shadow-sm focus:border-gray-400 focus:outline-none dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button
          onClick={handleCreate}
          disabled={!newTagName.trim()}
          className="flex items-center gap-1 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Tag list */}
      <div className="max-w-md space-y-2">
        {tags && tags.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            No tags yet. Create one above.
          </p>
        )}
        {tags?.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between rounded-lg bg-white p-3 shadow dark:bg-dark-secondary"
          >
            {editingId === tag.id ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="text"
                  className="flex-1 rounded border border-gray-300 p-1.5 text-sm focus:border-gray-400 focus:outline-none dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {tag.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(tag)}
                    className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsPage;
