import React from 'react';
import {
  ChevronDown,
  Search,
  Bell,
} from 'lucide-react';

export default function Topbar() {
  const projectTabs = [
    { label: 'Reece', active: false },
    { label: 'Design', active: false },
    { label: 'BOQ', active: false },
    { label: 'Order', active: false },
    { label: 'Work Progress', active: true },
    { label: 'Snag', active: false },
    { label: 'Finance', active: false },
    { label: 'Stock', active: false },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="space-y-3">
        {/* Row 1: Search + right info */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search........"
                className="w-full rounded-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-2.5
                           text-sm text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right: date, location, company, bell */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="relative rounded-full p-2 hover:bg-gray-50"
            >
              <Bell size={18} className="text-gray-500" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </button>

            <div className="text-right leading-tight text-xs">
              <p className="font-medium text-gray-900">September 29 2025</p>
              <p className="text-gray-500">Chennai | 22°C</p>
            </div>

            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              Ram Constructions
            </div>
          </div>
        </div>

        {/* Row 2: Project selector + breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Project selector */}
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
              <span>Downtown Tower Plaza</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-100">
                In Progress
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Program / breadcrumb */}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-medium text-gray-700">Projects</span>
              <span className="text-gray-400">›</span>
              <span>Downtown Tower Plaza</span>
            </div>
          </div>
        </div>

        {/* Row 3: Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {projectTabs.map((tab) => (
            <button
              key={tab.label}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-colors ${tab.active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}