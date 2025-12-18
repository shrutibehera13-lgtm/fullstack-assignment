'use client';

import React from 'react';

export default function ProgressChart() {
  const overall = 41; // overall % (change as needed)

  const dailyStats = [
    { label: 'Completed', value: 1 },
    { label: 'In Progress', value: 2 },
    { label: 'Not Started', value: 1 },
    { label: 'Delayed', value: 1 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 h-full">
      {/* Overall Project Progress */}
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

      {/* Daily Progress */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Daily Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dailyStats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <p className="text-xs text-gray-500 mb-2">{item.label}</p>
              <p className="text-2xl font-semibold text-gray-900 leading-none">
                {String(item.value).padStart(2, '0')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}