"use client";

import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchStatusSummary } from "@/app/store/slices/tasksSlice";

export default function ProgressChart() {
  const dispatch = useAppDispatch();
  const { statusSummary, statusSummaryLoading } = useAppSelector(
    (state) => state.tasks
  );
  console.log(statusSummary);

  useEffect(() => {
    dispatch(fetchStatusSummary());
  }, [dispatch]);

  const { overall, dailyStats } = useMemo(() => {
    if (!statusSummary || statusSummary.length === 0) {
      return {
        overall: 0,
        dailyStats: [
          { label: "Completed", value: 0 },
          { label: "In Progress", value: 0 },
          { label: "Not Started", value: 0 },
          { label: "Delayed", value: 0 },
        ],
      };
    }

    const totals = statusSummary.reduce(
      (acc, t) => {
        acc.totalSubtasks += t.totalSubtasks;
        acc.completed += t.totalCompletedSubtasks;
        acc.inProgress += t.inprogressSubtasks;
        acc.notStarted += t.notStartedSubtasks;
        acc.delayed += t.delayedSubtasks;
        return acc;
      },
      {
        totalSubtasks: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        delayed: 0,
      }
    );

    const overall =
      totals.totalSubtasks === 0
        ? 0
        : Math.round((totals.completed / totals.totalSubtasks) * 100);

    const dailyStats = [
      { label: "Completed", value: totals.completed },
      { label: "In Progress", value: totals.inProgress },
      { label: "Not Started", value: totals.notStarted },
      { label: "Delayed", value: totals.delayed },
    ];

    return { overall, dailyStats };
  }, [statusSummary]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-900">
            Overall Project Progress
          </h2>
          <span className="text-sm font-semibold text-gray-800">
            {overall}%
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Daily Progress</h3>
          {statusSummaryLoading && (
            <span className="text-xs text-gray-400">Loading…</span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dailyStats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <p className="text-xs text-gray-500 mb-2">{item.label}</p>
              <p className="text-2xl font-semibold text-gray-900 leading-none">
                {String(item.value).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
