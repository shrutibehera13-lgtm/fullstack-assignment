"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Eye, Pencil, Trash2, X } from "lucide-react";
import AddSubTaskModal from "../Modals/AddSubTaskModal";
import ViewTaskModal from "../Modals/ViewTaskModalProps";
import UpdateSubTaskModal from "../Modals/UpdateSubTaskModal";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchTasks,
  deleteTask,
  fetchTaskById,
  createSubtask,
  deleteSubtask,
  updateSubtask,
  fetchStatusSummary,
} from "@/app/store/slices/tasksSlice";
import { Employee, Labour, Subtask, Task } from "@/app/types";
import { formatDate } from "@/app/utils/date-utils";
import { employees } from "@/app/dummy";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal";

type EditingSubtaskContext = {
  taskId: string;
  subtaskId: string;
} | null;

type DeleteContext =
  | { type: "task"; taskId: string; taskTitle: string }
  | { type: "subtask"; taskId: string; subtaskId: string; subtaskName: string }
  | null;

export default function TasksTable() {
  const dispatch = useAppDispatch();
  const {
    items: backendTasks,
    loading,
    error,
  } = useAppSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAddSubTaskOpen, setIsAddSubTaskOpen] = useState(false);
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);
  const [viewSubtaskId, setViewSubtaskId] = useState<string | null>(null);
  const [deleteContext, setDeleteContext] = useState<DeleteContext>(null);
  const [isUpdateSubTaskOpen, setIsUpdateSubTaskOpen] = useState(false);
  const [editingSubtask, setEditingSubtask] =
    useState<EditingSubtaskContext>(null);

  const [updateInitialValues, setUpdateInitialValues] =
    useState<Subtask | null>(null);

  const projects = [
    { id: "p1", name: "Project A" },
    { id: "p2", name: "Project B" },
  ];

  const categories = ["Construction", "Electrical", "Plumbing"];

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(fetchTasks(searchTerm));
    }, 300);

    return () => clearTimeout(handler);
  }, [dispatch, searchTerm]);

  const uiTasks: Task[] = useMemo(() => backendTasks, [backendTasks]);

  const selectedUiTask: Task | null = useMemo(() => {
    if (!selectedTaskId) return null;
    const backendTask = backendTasks.find(
      (t: any) => (t._id || t.id) === selectedTaskId
    );
    return backendTask ?? null;
  }, [selectedTaskId, backendTasks]);

  const handleViewTask = (id: string) => {
    setSelectedTaskId(id);
    setViewSubtaskId(null);
    setIsViewTaskOpen(true);
    dispatch(fetchTaskById(id));
  };

  const handleViewSubtask = (taskId: string, subtaskId: string) => {
    setSelectedTaskId(taskId);
    setViewSubtaskId(subtaskId);
    setIsViewTaskOpen(true);
    dispatch(fetchTaskById(taskId));
  };

  const openDeleteTaskModal = (taskId: string, taskTitle: string) => {
    setDeleteContext({
      type: "task",
      taskId,
      taskTitle,
    });
  };

  const handleCreateSubtask = async (formData: Partial<Subtask>) => {
    if (!selectedTaskId) return;
    const payload = { ...formData, status: "in progress" as Subtask["status"] };
    await dispatch(
      createSubtask({
        taskId: selectedTaskId,
        subtask: payload,
      })
    );
  };

  const openDeleteSubtaskModal = (
    taskId: string,
    subtaskId: string,
    subtaskName: string
  ) => {
    setDeleteContext({
      type: "subtask",
      taskId,
      subtaskId,
      subtaskName,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteContext) return;

    if (deleteContext.type === "task") {
      const resultAction = await dispatch(deleteTask(deleteContext.taskId));

      if (deleteTask.fulfilled.match(resultAction)) {
        dispatch(fetchStatusSummary());

        if (selectedTaskId === deleteContext.taskId) {
          setIsViewTaskOpen(false);
          setSelectedTaskId(null);
        }
      }
    }

    if (deleteContext.type === "subtask") {
      await dispatch(
        deleteSubtask({
          taskId: deleteContext.taskId,
          subtaskId: deleteContext.subtaskId,
        })
      );
    }

    setDeleteContext(null);
  };

  const handleOpenCreateSubtask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsAddSubTaskOpen(true);
  };

  const handleOpenEditSubtask = (taskId: string, subtaskId: string) => {
    const backendTask = backendTasks.find((t) => t._id === taskId);
    const backendSubtask = backendTask?.subtasks?.find(
      (st) => st._id === subtaskId
    );
    if (!backendTask || !backendSubtask) return;
    setEditingSubtask({ taskId, subtaskId });
    setUpdateInitialValues(backendSubtask);
    setIsUpdateSubTaskOpen(true);
  };

  const handleUpdateSubtaskSave = async (data: Partial<Subtask>) => {
    if (!editingSubtask) return;
    await dispatch(
      updateSubtask({
        taskId: editingSubtask.taskId,
        subtaskId: editingSubtask.subtaskId,
        data,
      })
    );

    setIsUpdateSubTaskOpen(false);
    setEditingSubtask(null);
    setUpdateInitialValues(null);
  };

  if (loading && uiTasks.length === 0) {
    return (
      <div className="bg-white p-6">
        <p className="text-sm text-gray-500">Loading tasks…</p>
      </div>
    );
  }

  if (error && uiTasks.length === 0) {
    return (
      <div className="bg-white p-6">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by task or subtask..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {uiTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          No tasks found.
        </div>
      ) : (
        <div className="space-y-6">
          {uiTasks.map((task) => {
            const completedCount = task.subtasks.filter(
              (s) => s.status.toLowerCase() === "completed"
            ).length;
            const progress =
              task.subtasks.length === 0
                ? 0
                : Math.round((completedCount / task.subtasks.length) * 100);

            return (
              <div
                key={task._id}
                className="rounded-xl border-2 border-gray-200 bg-white"
              >
                {/* Header row */}
                <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
                  <div>
                    <h1
                      className="text-xl font-semibold text-gray-900 cursor-pointer hover:underline"
                      onClick={() => handleViewTask(task._id)}
                    >
                      {task.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-1.5 rounded text-sm bg-gray-200 text-gray-800">
                      {task.category}
                    </button>
                    <button className="px-4 py-1.5 rounded text-sm bg-emerald-100 text-emerald-700 border border-emerald-300">
                      Completed
                    </button>
                    {/* <button
                      className="px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                      onClick={() => handleViewTask(task._id)}
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button> */}
                    <button
                      className="px-3 py-1.5 rounded text-sm border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                      onClick={() => openDeleteTaskModal(task._id, task.title)}
                    >
                      <Trash2 size={14} />
                    </button>

                    <button
                      className="px-4 py-1.5 rounded text-sm bg-slate-900 text-white"
                      onClick={() => handleOpenCreateSubtask(task._id)}
                    >
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Progress row */}
                <div className="px-6 pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Subtasks table */}
                <div className="px-6 pb-6 pt-2">
                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                            Sub Task
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                            Start Date
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                            End Date
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                            Status
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                            Updated By
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {task.subtasks.map((subTask) => (
                          <tr key={subTask._id} className="bg-white">
                            <td className="px-4 py-2 text-gray-800">
                              {subTask.title}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {formatDate(subTask.startDate)}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {formatDate(subTask.dueDate)}
                            </td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center rounded-sm capitalize border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                {subTask.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {subTask.assignedTo.name}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2 ">
                                <button
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-600  bg-gray-100"
                                  onClick={() =>
                                    handleViewSubtask(task._id, subTask._id)
                                  }
                                  title="View"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-md p-1.5 text-blue-600 bg-blue-50"
                                  onClick={() =>
                                    handleOpenEditSubtask(task._id, subTask._id)
                                  }
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-md p-1.5 text-red-600 bg-red-50"
                                  onClick={() =>
                                    openDeleteSubtaskModal(
                                      task._id,
                                      subTask._id,
                                      subTask.title
                                    )
                                  }
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {task.subtasks.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-4 text-center text-xs text-gray-400"
                            >
                              No subtasks available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE Subtask Modal */}
      <AddSubTaskModal
        isOpen={isAddSubTaskOpen}
        onClose={() => setIsAddSubTaskOpen(false)}
        onSubmit={handleCreateSubtask}
        projects={projects}
        employees={employees}
        categories={categories}
      />

      {/* VIEW Task Modal */}
      {selectedUiTask && (
        <ViewTaskModal
          isOpen={isViewTaskOpen}
          onClose={() => {
            setIsViewTaskOpen(false);
            setViewSubtaskId(null);
          }}
          task={selectedUiTask}
          subtaskId={viewSubtaskId}
        />
      )}

      {/* UPDATE Subtask Modal */}
      {editingSubtask && updateInitialValues && (
        <UpdateSubTaskModal
          isOpen={isUpdateSubTaskOpen}
          onClose={() => {
            setIsUpdateSubTaskOpen(false);
            setEditingSubtask(null);
            setUpdateInitialValues(null);
          }}
          initialValues={updateInitialValues}
          onSave={handleUpdateSubtaskSave}
        />
      )}

      {/* Delete Subtask Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteContext}
        title={
          deleteContext?.type === "task" ? "Delete Task" : "Delete Subtask"
        }
        description={
          deleteContext?.type === "task" ? (
            <p>
              Are you sure you want to delete task{" "}
              <span className="font-semibold">“{deleteContext.taskTitle}”</span>
              ? This action cannot be undone.
            </p>
          ) : (
            <p>
              Are you sure you want to delete subtask{" "}
              <span className="font-semibold">
                “{deleteContext?.subtaskName}”
              </span>
              ? This action cannot be undone.
            </p>
          )
        }
        onCancel={() => setDeleteContext(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
