"use client";

import React from "react";
import { X } from "lucide-react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title?: string;
  description: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDeleteModal({
  isOpen,
  title = "Confirm Delete",
  description,
  onCancel,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-4 pb-2 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-sm text-gray-700">{description}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 pb-4 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
