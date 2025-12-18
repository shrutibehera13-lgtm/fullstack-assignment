// components/Modals/usage/AddMachineUsageModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: { machineName: string; description: string }) => void;
}

export default function AddMachineUsageModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [machineName, setMachineName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMachineName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineName.trim()) return;
    onSubmit({ machineName, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl">
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Machine Usage
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 pt-4 pb-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Machine Name
            </label>
            <input
              type="text"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm
                         border border-transparent focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm
                         border border-transparent focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         focus:bg-white resize-none"
            />
          </div>

          <button
            type="button"
            className="text-xs text-blue-700 font-medium hover:underline"
          >
            + Add More Worker
          </button>

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium
                         text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm font-medium text-white
                         bg-slate-900 hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}