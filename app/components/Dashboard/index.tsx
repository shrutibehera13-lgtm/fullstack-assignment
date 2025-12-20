"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ProgressLogs from "./ProgressLogs";
import TasksTable from "./TasksTable";
import ProgressChart from "./ProgressChart";
import AssignNewTaskModal from "../Modals/AssignNewTaskModal";
import { employees } from "@/app/dummy";

const mockProjects = [
  { id: "1", name: "Downtown Tower Plaza" },
  { id: "2", name: "Green Valley Apartments" },
  { id: "3", name: "Tech Park Office Complex" },
];

const mockCategories = [
  "Masonry & Plastering",
  "Structural Work",
  "Electrical",
  "Plumbing",
  "Painting",
  "Flooring",
  "Carpentry",
];

export default function Dashboard() {
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="mb-6 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Work Progress &amp; Execution
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track construction milestones, daily execution, and site
                  performance.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                    Site A • On track
                  </span>
                  <span>Last updated: 5 mins ago</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-start md:justify-end">
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => setShowAssignTaskModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Assign Task</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <ProgressChart />
            </div>
            <div className="mb-6">
              <ProgressLogs />
            </div>
            <div>
              <TasksTable />
            </div>
          </div>
        </div>
      </div>
      <AssignNewTaskModal
        isOpen={showAssignTaskModal}
        onClose={() => setShowAssignTaskModal(false)}
        projects={mockProjects}
        employees={employees}
        categories={mockCategories}
      />
    </>
  );
}
