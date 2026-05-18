"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { categoryService } from "@/services/categoryService";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: string; name: string; totalProducts: number } | null;
  onDelete: () => void;
}

export const DeleteCategoryModal = ({
  isOpen,
  onClose,
  category,
  onDelete,
}: DeleteModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !category) return null;

  const canDelete = category.totalProducts === 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError("");
      await categoryService.delete(category.id);
      onDelete();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {!canDelete ? (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >          
            <X size={20} strokeWidth={2.5} />
          </button>
        ): null}

        <div className="pt-2 text-center">
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: '#cc2229' }}
          >
            Delete Category
          </h3>

          {canDelete ? (
            <>
              <p className="text-base text-gray-800 mb-8 font-medium">
                Are you sure you want to delete <span className="font-bold text-black">"{category.name}"</span>?
                <br/>
                This action cannot be undone.
              </p>

              {error && <p className="text-sm text-red-600 mb-4 font-medium">{error}</p>}

              <div className="flex flex-row justify-center gap-4 w-full">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full font-bold shadow-md transition-opacity hover:opacity-80 text-base disabled:opacity-50"
                  style={{ backgroundColor: '#ff6d00', color: '#ffffff' }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full font-bold shadow-md transition-opacity hover:opacity-80 text-base disabled:opacity-50"
                  style={{ backgroundColor: '#cc2229', color: '#ffffff' }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-gray-600 mb-6 font-medium">
                Category <span className="font-bold text-gray-900">"{category.name}"</span> contains {category.totalProducts} product
                {category.totalProducts > 1 ? "s" : ""} and cannot be deleted.
              </p>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-left text-orange-700 mb-6">
                <p className="font-bold text-base">Delete not allowed</p>
                <p className="mt-1 text-sm font-medium">
                  Only categories with no products can be removed.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};