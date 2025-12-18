import React from 'react';
import { X } from 'lucide-react';
import { Subtask, Task } from '@/app/types';
import { formatDate } from '@/app/utils/date-utils';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task:  Task;
  subtaskId?: string | null; 
}

const placeholderImages = [
  'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/280923/pexels-photo-280923.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=400',
];

export default function ViewTaskModal({
  isOpen,
  onClose,
  task,
  subtaskId = null,
}: ViewTaskModalProps) {
  if (!isOpen) return null;

  const completedCount = task.subtasks.filter(
    (s) => s.status.toLowerCase() === 'completed'
  ).length;
  const progress =
    task.subtasks.length === 0
      ? 0
      : Math.round((completedCount / task.subtasks.length) * 100);

  const overallStatus =
    completedCount === task.subtasks.length ? 'Completed' : 'In Progress';

  const visibleSubTasks =
    subtaskId == null
      ? task.subtasks
      : task.subtasks.filter((st) => st._id === subtaskId);
      

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start px-6 pt-6 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {task.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Detailed view of phase progress and task breakdown
              {subtaskId && visibleSubTasks.length === 1
                ? ` • ${visibleSubTasks[0].title}`
                : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Progress</p>
              <p className="text-lg font-semibold text-gray-900">
                {progress}%
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="text-sm font-semibold text-gray-900">
                {overallStatus}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Timeline</p>
              <p className="text-xs font-medium text-gray-900 leading-snug">
                {formatDate(task.startDate)} - {formatDate(task.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pt-3 pb-4 space-y-4">
          {visibleSubTasks.length === 0 ? (
            <p className="text-xs text-gray-500">
              No subtasks to display for this view.
            </p>
          ) : (
            visibleSubTasks.map((subTask, index) => (
              <div
                key={subTask._id}
                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
              >
                {/* Title + date + comments */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      {subTask.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">No delays</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {formatDate(subTask.startDate)} - {subTask.dueDate}
                    </p>
                    <button
                      type="button"
                      className="mt-1 text-xs text-blue-600 hover:underline"
                    >
                      Comments({index % 2})
                    </button>
                  </div>
                </div>

                {/* Images row */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Images
                  </p>
                  <div className="flex gap-2 overflow-x-auto">
                    {placeholderImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Task"
                        className="h-16 w-24 rounded-md object-cover"
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="border-t border-gray-200 pt-2 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-xs text-gray-700">
                  <p>
                    <span className="font-semibold">Updated By - </span>
                    {subTask.assignedTo.name}
                  </p>
                  <p>
                    <span className="font-semibold">Material Used</span>{' '}
                {subTask.materialUsages.map((material)=>material.materialUsed).join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold">Labour Used</span>{' '}
{/* {subTask.manPowerUsages.map((material)=>material.workerName).join}   */}
                </p>
                  <p>
                    <span className="font-semibold">Machinery Used</span>{' '}
                    {subTask.machineryUsages.map((machine)=>machine.machineName).join(", ")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 pb-5 pt-3 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium
                       text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white
                       bg-slate-900 hover:bg-slate-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}