"use client";

import { Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createSubtask,
  createTask,
  deleteSubtask,
  deleteTask,
  fetchStatusSummary,
  fetchSubTaskById,
  fetchTaskById,
  fetchTasks,
  updateSubtask,
  updateTask,
} from "./slices/tasksSlice";

export const toastMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);
  const { type, payload } = action as { type: string; payload?: any };

  switch (type) {
    // TASKS
    case createTask.fulfilled.type:
      toast.success("Task created successfully");
      break;
    case createTask.rejected.type:
      toast.error(payload || "Failed to create task");
      break;

    case updateTask.fulfilled.type:
      toast.success("Task updated successfully");
      break;
    case updateTask.rejected.type:
      toast.error(payload || "Failed to update task");
      break;

    case deleteTask.fulfilled.type:
      toast.success("Task deleted successfully");
      break;
    case deleteTask.rejected.type:
      toast.error(payload || "Failed to delete task");
      break;

    // SUBTASKS
    case createSubtask.fulfilled.type:
      toast.success("Subtask created successfully");
      break;
    case createSubtask.rejected.type:
      toast.error(payload || "Failed to create subtask");
      break;

    case updateSubtask.fulfilled.type:
      toast.success("Subtask updated successfully");
      break;
    case updateSubtask.rejected.type:
      toast.error(payload || "Failed to update subtask");
      break;

    case deleteSubtask.fulfilled.type:
      toast.success("Subtask deleted successfully");
      break;
    case deleteSubtask.rejected.type:
      toast.error(payload || "Failed to delete subtask");
      break;

    // OPTIONAL: fetch errors
    case fetchTasks.rejected.type:
      toast.error(payload || "Failed to fetch tasks");
      break;

    case fetchTaskById.rejected.type:
      toast.error(payload || "Failed to fetch task");
      break;

    case fetchSubTaskById.rejected.type:
      toast.error(payload || "Failed to fetch subtask");
      break;

    case fetchStatusSummary.rejected.type:
      toast.error(payload || "Failed to fetch status summary");
      break;

    default:
      break;
  }

  return result;
};
