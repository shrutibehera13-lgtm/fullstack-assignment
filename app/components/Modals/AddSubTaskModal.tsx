import React, { useState } from "react";
import { X } from "lucide-react";
import { Employee, Subtask } from "@/app/types";

interface AddSubTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subtaskData: any) => void;
  projects: Array<{ id: string; name: string }>;
  employees: Employee[];
  categories: string[];
}

export default function AddSubTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  employees = [],
  categories = [],
}: AddSubTaskModalProps) {
  const [subtaskData, setSubtaskData] = useState<Partial<Subtask>>({
    title: "",
    projectName: "",
    location: "",
    category: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subtaskWithId = {
      ...subtaskData,
      id: Date.now().toString(),
      status: "in progress",
    };
    onSubmit(subtaskWithId);
    onClose();
    setSubtaskData({
      title: "",
      projectName: "",
      location: "",
      category: "",
    });
  };

  const handleInputChange = (
    field: keyof Subtask,
    value: Subtask[keyof Subtask]
  ) => {
    setSubtaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-2 pb- border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Sub Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-2">
          {/* SubTask Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              SubTask Title
            </label>
            <input
              type="text"
              required
              value={subtaskData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="SubTask Title"
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
              value={subtaskData.projectName}
              onChange={(e) => handleInputChange("projectName", e.target.value)}
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

          {/* Location/Floor/Room */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Location/Floor/Room
            </label>
            <input
              type="text"
              required
              value={subtaskData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Location/Floor/Room"
              className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white text-sm"
            />
          </div>

          {/* SubTask Category */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              SubTask Category
            </label>
            <select
              required
              value={subtaskData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white text-sm"
            >
              <option value="">SubTask Category</option>
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
              value={subtaskData.assignedTo?._id}
              onChange={(e) => {
                const employeeId = e.target.value;
                const employee = employees.find(
                  (user) => user._id === employeeId
                );
                if (employee) {
                  handleInputChange("assignedTo", {
                    _id: employee._id,
                    name: employee.name,
                    role: employee.role,
                    isSkilled: employee.isSkilled,
                  });
                }
              }}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white text-sm"
            >
              <option value="">Assigned To</option>
              {employees.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Starting Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Starting Date
            </label>
            <input
              type="date"
              required
              value={
                subtaskData.startDate
                  ? subtaskData.startDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleInputChange("startDate", new Date(e.target.value))
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white text-sm"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Due Date
            </label>
            <input
              type="date"
              required
              value={
                subtaskData.dueDate
                  ? subtaskData.dueDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleInputChange("dueDate", new Date(e.target.value))
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium
                         text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white
                         bg-slate-900 hover:bg-slate-800"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
