import { Trash2, Edit2 } from "lucide-react";
import { Subtask } from "@/app/types";
import { formatDate } from "@/app/utils/date-utils";

interface SubtaskListProps {
  subtasks: Subtask[];
  onRemoveSubtask?: (id: string) => void;
  onAddSubtask?: (subtask: Subtask) => void;
}

export default function SubtaskList({
  subtasks = [],
  onRemoveSubtask,
}: SubtaskListProps) {
  if (subtasks.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <p className="text-gray-500 font-medium">No subtasks added yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Click “Add Subtask” to add one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subtasks.map((subtask) => (
        <div
          key={subtask._id}
          className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          {/* DELETE BUTTON */}
          <button
            type="button"
            onClick={() => onRemoveSubtask?.(subtask._id)}
            className="absolute top-3 right-3 p-2 rounded-lg text-gray-400
                       hover:text-red-600 hover:bg-red-50 opacity-0
                       group-hover:opacity-100 transition"
          >
            <Trash2 size={16} />
          </button>

          {/* TITLE */}
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {subtask.title}
          </h4>

          {/* META */}
          <div className="flex flex-wrap gap-2 text-xs mt-2">
            <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600">
              {subtask.category}
            </span>

            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600">
              {subtask.assignedTo.name}
            </span>
          </div>

          {/* DATE */}
          <p className="mt-2 text-xs text-gray-500">
            {formatDate(subtask.startDate)} – {formatDate(subtask.dueDate)}
          </p>
        </div>
      ))}
    </div>
  );
}
