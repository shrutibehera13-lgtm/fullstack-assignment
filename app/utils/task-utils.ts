import { Subtask } from "../types";

export type TaskProgress = {
  progress: number;
  status: "not started" | "in progress" | "delayed" | "completed";
};

export function getTaskProgress(subtasks: Subtask[]): TaskProgress {
  if (!subtasks || subtasks.length === 0) {
    return { progress: 0, status: "not started" };
  }

  const total = subtasks.length;
  const completed = subtasks.filter(
    (s) => s.status.toLowerCase() === "completed"
  ).length;

  const hasDelayed = subtasks.some((s) => s.status.toLowerCase() === "delayed");

  const progress = Math.round((completed / total) * 100);

  if (completed === 0) return { progress: 0, status: "not started" };
  if (completed === total) return { progress: 100, status: "completed" };
  if (hasDelayed) return { progress, status: "delayed" };
  return { progress, status: "in progress" };
}
