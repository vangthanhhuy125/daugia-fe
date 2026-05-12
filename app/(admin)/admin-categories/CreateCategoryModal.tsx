import { useState } from "react";
import { X } from "lucide-react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string }) => void;
}

export const CreateCategoryModal = ({ isOpen, onClose, onCreate }: CreateModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    onCreate({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="space-y-5 pt-2">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Create New Category</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-800">
                Category name <span className="text-red-600">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                type="text"
                placeholder="Enter category name"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800">Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter description"
                className="mt-2 h-48 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-center pt-2">
            <button
              onClick={handleCreate}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};