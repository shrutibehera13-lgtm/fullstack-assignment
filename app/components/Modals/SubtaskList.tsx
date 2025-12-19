import { Trash2, Edit2 } from 'lucide-react';
import { Subtask } from '@/app/types';
import { formatDate } from '@/app/utils/date-utils';

interface SubtaskListProps {
  subtasks: Subtask[];
  onRemoveSubtask?: (id: string) => void;
  onAddSubtask?: (subtask: Subtask) => void;
}

export default function SubtaskList({ subtasks = [], onRemoveSubtask }: SubtaskListProps) {
  if (subtasks.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No subtasks added yet</p>
        <p className="text-sm text-gray-400 mt-1">Click "Add Subtask" to add one</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subtasks.map((subtask) => (
        <div
          key={subtask._id}
          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-gray-800">{subtask.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{subtask.category}</span>
                  <span>•</span>
                  <span>Assigned to: {subtask.assignedTo .name}</span>
                  <span>•</span>
                  <span>{formatDate(subtask.startDate)} - {formatDate(subtask.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              onClick={() => console.log('Edit subtask', subtask._id)}
            >
              <Edit2 size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              onClick={() => onRemoveSubtask && onRemoveSubtask(subtask._id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}