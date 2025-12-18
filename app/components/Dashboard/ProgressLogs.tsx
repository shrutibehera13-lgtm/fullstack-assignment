import React from 'react';

export default function ProgressLogs() {
  const logs = [
    { id: 1, title: 'Masonry & Plastering', date: 'Oct 7, 2025', worker: 'Amit Patel', progress: 65 },
    { id: 2, title: 'Structural Work', date: 'Oct 8, 2025', worker: 'Raj Kumar', progress: 65 },
    { id: 3, title: 'Structural Work', date: 'Oct 8, 2025', worker: 'Raj Kumar', progress: 65 },
    { id: 4, title: 'Masonry & Plastering', date: 'Oct 7, 2025', worker: 'Amit Patel', progress: 65 },
    { id: 5, title: 'Structural Work', date: 'Oct 8, 2025', worker: 'Raj Kumar', progress: 65 },
    { id: 6, title: 'Structural Work', date: 'Oct 8, 2025', worker: 'Raj Kumar', progress: 65 },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 mb-3 mt-3 ml-2">
        Daily Progress Logs
      </h2>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {log.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {log.date} • {log.worker}
              </p>
            </div>

            <span className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {log.progress}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}