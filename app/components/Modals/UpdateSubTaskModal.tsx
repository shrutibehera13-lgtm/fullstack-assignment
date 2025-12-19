"use client";

import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import AddMaterialUsageModal from "./AddMaterialUsageModal";
import AddManPowerUsageModal from "./AddManPowerUsageModal";
import AddMachineUsageModal from "./AddMachineUsageModal";
import {
  MachineryUsage,
  ManPowerUsage,
  MaterialUsage,
  Subtask,
} from "@/app/types";

interface UpdateSubTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: Subtask;
  onSave: (data: typeof emptyState) => void;
}

const emptyState: Omit<
  Subtask,
  | "dueDate"
  | "projectName"
  | "category"
  | "location"
  | "_id"
  | "assignedTo"
  | "startDate"
> = {
  title: "",
  status: "in progress",
  delay: "",
  reasonForDelay: "",
  images: [] as string[],
  materialUsages: [],
  manPowerUsages: [],
  machineryUsages: [],
};

const statusOptions: Array<{
  name: string;
  value: Subtask["status"];
}> = [
  { name: "Not Started", value: "not started" },
  { name: "In Progress", value: "in progress" },
  { name: "Completed", value: "completed" },
  { name: "Delayed", value: "delayed" },
];

export default function UpdateSubTaskModal({
  isOpen,
  onClose,
  initialValues,
  onSave,
}: UpdateSubTaskModalProps) {
  const [form, setForm] = useState(emptyState);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [manPowerModalOpen, setManPowerModalOpen] = useState(false);
  const [machineryModalOpen, setMachineryModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialValues) {
      setForm(initialValues);
    } else {
      setForm(emptyState);
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleFakeUpload = () => {
    const url = "https://via.placeholder.com/300x180.png?text=Uploaded";
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const addMaterialUsage = (item: MaterialUsage) => {
    setForm((prev) => ({
      ...prev,
      materialUsages: [...prev.materialUsages, item],
    }));
  };

  const addManPowerUsage = (item: ManPowerUsage) => {
    setForm((prev) => ({
      ...prev,
      manPowerUsages: [...prev.manPowerUsages, item],
    }));
  };

  const addMachineryUsage = (item: MachineryUsage) => {
    setForm((prev) => ({
      ...prev,
      machineryUsages: [...prev.machineryUsages, item],
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          {" "}
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Update Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <form
            onSubmit={handleSave}
            className="px-6 pt-4 pb-6 space-y-3 flex-1 overflow-y-auto custom-scrollbar"
          >
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Task Name/Subtask Name
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm
                           border border-transparent focus:outline-none
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as Subtask["status"],
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm
             border border-transparent focus:outline-none
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             focus:bg-white"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Delay */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Delay
              </label>
              <input
                type="text"
                value={form.delay ?? ""}
                name={"delay"}
                onChange={(e) => handleChange("delay", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm
                           border border-transparent focus:outline-none
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white"
              />
            </div>

            {/* Reason For Delay */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Reason For Delay
              </label>
              <textarea
                value={form.reasonForDelay}
                onChange={(e) => handleChange("reasonForDelay", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm
                           border border-transparent focus:outline-none
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white resize-none"
              />
            </div>

            {/* Add Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Add Image
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl py-6 px-4
                           flex flex-col items-center justify-center text-xs text-gray-500
                           cursor-pointer hover:border-blue-500 hover:text-blue-600"
                onClick={handleFakeUpload}
              >
                <Upload className="mb-2 text-gray-400" size={22} />
                <p className="font-medium mb-1">
                  Upload A File Or Drag And Drop
                </p>
                <p>Png,Jpg,Gif Upto 50MB</p>
              </div>
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {form.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Uploaded"
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom usage buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMaterialModalOpen(true)}
                className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                + Material Usage
              </button>
              <button
                type="button"
                onClick={() => setManPowerModalOpen(true)}
                className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                + Man Power
              </button>
              <button
                type="button"
                onClick={() => setMachineryModalOpen(true)}
                className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                + Machinery
              </button>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium
                           text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white
                           bg-slate-900 hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Usage Modals */}
      <AddMaterialUsageModal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        onSubmit={addMaterialUsage}
      />
      <AddManPowerUsageModal
        isOpen={manPowerModalOpen}
        onClose={() => setManPowerModalOpen(false)}
        onSubmit={addManPowerUsage}
        selectedManPowers={form.manPowerUsages}
      />
      <AddMachineUsageModal
        isOpen={machineryModalOpen}
        onClose={() => setMachineryModalOpen(false)}
        onSubmit={addMachineryUsage}
      />
    </>
  );
}
