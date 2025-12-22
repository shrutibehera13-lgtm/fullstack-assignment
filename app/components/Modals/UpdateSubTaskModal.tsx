"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, FileX2 } from "lucide-react";
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
  onSave: (data: FormData) => void;
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
  | "comments"
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
  const [uploadedImages, setUploadedImages] = useState<Array<File>>([]);
  const [uploadedimagesPreview, setUploadedimagesPreview] = useState<
    Array<string>
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  function base64ToFile(base64: string, filename: string) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const { images, ...restFormdata } = form;
    for (const [key, value] of Object.entries(restFormdata)) {
      if (typeof value === "string") {
        formData.append(key, value);
      } else formData.append(key, JSON.stringify(value));
    }
    formData.append(
      "images",
      JSON.stringify(form.images.filter((image) => image.includes("uploads")))
    );
    uploadedImages.forEach((image) => formData.append("newImages", image));

    onSave(formData);
    onClose();
  };

  const handleFakeUpload = () => {
    // Open the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadedImages((val) => [...val, ...files]);
  };

  const addMaterialUsage = (item: MaterialUsage) => {
    setForm((prev) => ({
      ...prev,
      materialUsages: [...prev.materialUsages, item],
    }));
  };

  const convertUploadedImagesToBase64 = async (): Promise<Array<string>> => {
    const images = uploadedImages.map((image) => URL.createObjectURL(image));
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      const base64Images = await Promise.all(uploadedImages.map(toBase64));
      return base64Images;
    } catch (error) {
      return [];
    }
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

  useEffect(() => {
    (async () => {
      const base64Images = await convertUploadedImagesToBase64();
      setUploadedimagesPreview(base64Images);
    })();
  }, [uploadedImages]);

  const handleRemoveImage = (imageIdx: number, type: "FORM" | "UPLOADED") => {
    switch (type) {
      case "FORM":
        setForm((prev) => ({
          ...prev,
          images: prev.images.filter((image, idx) => idx !== imageIdx),
        }));
        break;
      case "UPLOADED":
        setUploadedImages((prev) =>
          prev.filter((image, idx) => idx !== imageIdx)
        );
        break;
      default:
        break;
    }
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
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap gap-2 mt-1 relative">
                {form.images?.map((src, i) => (
                  <div
                    key={`form-image-${i}`}
                    className="h-12 w-20 rounded-md relative shadow border border-gray-400"
                  >
                    <X
                      className="absolute top-1 right-1 text-gray-400 aspect-square w-3 h-3 rounded-full bg-black"
                      onClick={() => handleRemoveImage(i, "FORM")}
                    />
                    <img
                      src={process.env.NEXT_PUBLIC_IMG_BASE_URL + src}
                      alt="Uploaded"
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  </div>
                ))}

                {uploadedimagesPreview.map((src, i) => (
                  <div
                    key={`uploaded-image-${i}`}
                    className="h-12 w-20 rounded-md relative shadow border border-gray-400"
                  >
                    <X
                      className="absolute top-1 right-1 text-gray-400 aspect-square w-3 h-3 rounded-full bg-black"
                      onClick={() => handleRemoveImage(i, "UPLOADED")}
                    />
                    <img
                      src={src}
                      alt="Uploaded"
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom usage buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMaterialModalOpen(true)}
                className="flex-1 px-3 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                + Material Usage
              </button>
              <button
                type="button"
                onClick={() => setManPowerModalOpen(true)}
                className="flex-1 px-3 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
              >
                + Man Power
              </button>
              <button
                type="button"
                onClick={() => setMachineryModalOpen(true)}
                className="flex-1 px-3 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
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
