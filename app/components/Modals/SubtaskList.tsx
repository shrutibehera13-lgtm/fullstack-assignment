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
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No subtasks added yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Click "Add Subtask" to add one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subtasks.map((subtask) => (
        <div
          key={subtask._id}
          className="grid grid-cols-[1fr_auto] gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
              <div className="min-w-0">
                <h4 className="font-medium text-gray-800 break-words">
                  {subtask.title}
                </h4>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mt-1">
                  <span className="whitespace-nowrap">{subtask.category}</span>
                  <span>•</span>
                  <span className="truncate">
                    Assigned to: {subtask.assignedTo.name}
                  </span>
                  <span>•</span>
                  <span className="whitespace-nowrap">
                    {formatDate(subtask.startDate)} –{" "}
                    {formatDate(subtask.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-start gap-2 shrink-0">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              onClick={() => onRemoveSubtask?.(subtask._id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
