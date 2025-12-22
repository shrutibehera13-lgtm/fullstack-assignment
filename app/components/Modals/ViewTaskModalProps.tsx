import React, { useState } from "react";
import { X } from "lucide-react";
import { ManPowerUsage, Subtask, Task } from "@/app/types";
import { formatDate } from "@/app/utils/date-utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addCommentToTask, fetchTasks } from "@/app/store/slices/tasksSlice";

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  subtaskId?: string | null;
}

const placeholderImages = [
  "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/280923/pexels-photo-280923.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=400",
];

export default function ViewTaskModal({
  isOpen,
  onClose,
  task,
  subtaskId = null,
}: ViewTaskModalProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [activeCommentsSubtaskId, setActiveCommentsSubtaskId] = useState<
    string | null
  >(null);
  const [replyText, setReplyText] = useState("");
  const DUMMY_AVATAR =
    "https://ui-avatars.com/api/?name=User&background=CBD5E1&color=1F2937";

  if (!isOpen) return null;

  const completedCount = task.subtasks.filter(
    (s) => s.status.toLowerCase() === "completed"
  ).length;
  const progress =
    task.subtasks.length === 0
      ? 0
      : Math.round((completedCount / task.subtasks.length) * 100);

  const overallStatus =
    completedCount === task.subtasks.length ? "Completed" : "In Progress";

  const visibleSubTasks =
    subtaskId == null
      ? task.subtasks
      : task.subtasks.filter((st) => st._id === subtaskId);

  const getFormattedString = (text: string | undefined) => {
    if (!text) return "N/A";
    if (!text.length) return "N/A";
    return text;
  };

  const getManpowerUsageStats = (data: ManPowerUsage[]) => {
    let skilled = 0,
      unSkilled = 0;
    data.forEach((item) => {
      if (item.isSkilled) skilled += 1;
      else unSkilled += 1;
    });
    return `Skilled: ${skilled} | UnSkilled: ${unSkilled}`;
  };

  const activeSubtask: Subtask | null =
    visibleSubTasks.find((st) => st._id === activeCommentsSubtaskId) ?? null;
  const comments = activeSubtask?.comments ?? [];

  const taskImages = task.subtasks
    .map((subtask) => subtask.images)
    .flat()
    .map((src) => process.env.NEXT_PUBLIC_IMG_BASE_URL + src);

  const handleSendReply = async () => {
    if (!replyText.trim() || !user) return;
    await dispatch(
      addCommentToTask({
        taskId: task._id,
        subtaskId: activeSubtask?._id,
        message: replyText,
        employeeId: user?._id ?? "",
        senderName: user?.name,
      })
    );
    await dispatch(fetchTasks());
    setReplyText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-3xl w-full max-h-[90vh] shadow-xl flex flex-col overflow-hidden ${
          activeCommentsSubtaskId ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
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
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveCommentsSubtaskId(null);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div
          className={`px-6 pt-4 pb-5 flex-1 overflow-y-auto ${
            activeCommentsSubtaskId ? "lg:grid lg:grid-cols-2 lg:gap-4" : ""
          } custom-scrollbar`}
        >
          <div
            className={
              activeCommentsSubtaskId
                ? "lg:pr-4 lg:border-r lg:border-gray-200"
                : ""
            }
          >
            <div className="pb-2">
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

            <div className="pt-3 pb-4 space-y-4">
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
                        <p className="text-xs text-gray-500 mt-0.5">
                          No delays
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">
                          {formatDate(subTask.startDate)} -{" "}
                          {formatDate(subTask.dueDate)}
                        </p>
                        <button
                          type="button"
                          className="mt-1 text-xs text-blue-600 hover:underline"
                          onClick={() =>
                            setActiveCommentsSubtaskId(subTask._id as string)
                          }
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
                        {taskImages.map((src, i) => (
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
                        <span className="font-semibold">Material Used</span>{" "}
                        {getFormattedString(
                          subTask.materialUsages
                            .map((material) => material.materialUsed)
                            .join(", ")
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Labour Used</span>{" "}
                        {getManpowerUsageStats(subTask.manPowerUsages)}
                      </p>
                      <p>
                        <span className="font-semibold">Machinery Used</span>{" "}
                        {getFormattedString(
                          subTask.machineryUsages
                            .map((machine) => machine.machineName)
                            .join(", ")
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {activeCommentsSubtaskId && (
            <div className="mt-4 lg:mt-0 lg:pl-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 h-full flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Comments
                </h3>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search Comment Or People"
                  className="w-full mb-3 px-3 py-2 rounded-lg bg-white text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {!activeSubtask ? (
                    <p className="text-xs text-gray-400">
                      No comments yet for this subtask.
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const isOwn = user?._id == comment.employeeId;

                      if (isOwn)
                        return (
                          <div
                            key={comment._id}
                            className="flex justify-end text-xs text-white"
                          >
                            <div className="bg-slate-800 rounded-2xl px-3 py-2 max-w-xs w-100">
                              <div className="flex justify-between">
                                <div className="text-[10px] text-gray-400">
                                  {formatDate(new Date(comment.createdAt))}
                                </div>
                                <div className="text-right mb-2">
                                  <div className="font-semibold text-[13px]">
                                    {comment.senderName}
                                  </div>
                                  <div className="text-[10px] opacity-80">
                                    Engineer
                                  </div>
                                </div>
                              </div>
                              <p className="text-[13px] leading-snug text-right">
                                {comment.message}
                              </p>
                            </div>
                          </div>
                        );

                      return (
                        <div
                          key={comment._id}
                          className="rounded-2xl bg-white border border-gray-200 px-3 py-2 text-xs text-gray-800"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <p className="font-semibold text-[13px]">
                                {comment.senderName}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Engineer
                              </p>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {formatDate(new Date(comment.createdAt))}
                            </span>
                          </div>
                          <p className="text-[13px] leading-snug">
                            {comment.message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply */}
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Reply To The comments"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 pb-5 pt-3 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setActiveCommentsSubtaskId(null);
              onClose();
            }}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium
                       text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
