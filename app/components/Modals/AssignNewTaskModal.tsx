import React, { useState } from 'react';
import { X } from 'lucide-react';
import AddSubTaskModal from './AddSubTaskModal';
import SubtaskList from './SubtaskList';
import { createTask } from '@/app/store/slices/tasksSlice';
import { useAppDispatch } from '@/app/store/hooks';

interface AssignNewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Array<{ id: string; name: string }>;
  users: Array<{ id: string; name: string }>;
  categories: string[];
}

export default function AssignNewTaskModal({
  isOpen,
  onClose,
  projects = [],
  users = [],
  categories = [],
}: AssignNewTaskModalProps) {
  const [taskData, setTaskData] = useState({
    title: '',
    projectName: '',
    location: '',
    category: '',
    assignedTo: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    subtasks: [] as any[],
  });

  const dispatch = useAppDispatch();
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resultAction = await dispatch(createTask(taskData));
    if (createTask.fulfilled.match(resultAction)) {
      onClose();
    } else {
      const errMsg =
        (resultAction.payload as string) || 'Failed to create task';
      alert(errMsg);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSubtask = (subtask: any) => {
    setTaskData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, subtask],
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Assign New Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Task Title
              </label>
              <input
                type="text"
                required
                value={taskData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Task Title"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              />
            </div>

            {/* Project Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Project Name
              </label>
              <select
                required
                value={taskData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              >
                <option value="">Project Name</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Location/Floor/Room
              </label>
              <input
                type="text"
                required
                value={taskData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Location/Floor/Room"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              />
            </div>

            {/* Task Category */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Task Category
              </label>
              <select
                required
                value={taskData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              >
                <option value="">Task Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Assigned To
              </label>
              <select
                required
                value={taskData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              >
                <option value="">Assigned To</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Priority
              </label>
              <select
                required
                value={taskData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Start Date
              </label>
              <input
                type="date"
                required
                value={taskData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                End Date
              </label>
              <input
                type="date"
                required
                value={taskData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white text-sm"
              />
            </div>

            {/* Subtask */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-800">
                  Subtask
                </label>
                <button
                  type="button"
                  onClick={() => setShowSubTaskModal(true)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  + Add Subtask
                </button>
              </div>
              <div className="rounded-lg bg-gray-100 border border-transparent px-3 py-2 text-xs text-gray-600 min-h-[40px]">
                {taskData.subtasks.length === 0 ? (
                  <span className="text-gray-400">No subtasks added</span>
                ) : (
                  <SubtaskList subtasks={taskData.subtasks} />
                )}
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between gap-3">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Load Templates
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSubTaskModal && (
        <AddSubTaskModal
          isOpen={showSubTaskModal}
          onClose={() => setShowSubTaskModal(false)}
          onSubmit={handleAddSubtask}
          projects={projects}
          users={users}
          categories={categories}
        />
      )}
    </>
  );
}