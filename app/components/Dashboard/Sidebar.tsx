import React from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Users,
  Briefcase,
  Search,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: TrendingUp, label: "Projects", active: true },
    { icon: Settings, label: "Administration", active: false },
    { icon: Users, label: "Vendor Management", active: false },
    { icon: Briefcase, label: "Labour Management", active: false },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo / Header */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
              SB
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-gray-900">
                Shruti Behera
              </p>
              <p className="text-[11px] text-gray-500">Project Console</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
            Live
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <li key={item.label}>
                <button
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-1 left-0 w-1 rounded-full bg-blue-500"
                      aria-hidden
                    />
                  )}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[15px] ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Quick search</p>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
