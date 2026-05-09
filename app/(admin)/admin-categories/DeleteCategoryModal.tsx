import { X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
}

export const DeleteCategoryModal = ({ isOpen, onClose, categoryName }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative text-center shadow-2xl animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-8 top-8 text-black hover:scale-110 transition-transform">
          <X size={32} strokeWidth={2.5} />
        </button>
        
        <h3 className="text-[#CE2029] text-3xl font-black mb-4">Delete Category</h3>
        
        <div className="space-y-1 mb-8">
          <p className="text-gray-800 text-lg font-medium">
            Are you sure you want to delete <span className="font-black italic">"{categoryName}"</span>?
          </p>
          <p className="text-gray-500">This action cannot be undone.</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={onClose}
            className="bg-[#FF6B00] text-white font-black px-8 py-3.5 rounded-full hover:opacity-90 transition-all min-w-[120px] shadow-lg shadow-orange-100 active:scale-95"
          >
            Cancel
          </button>
          <button 
            className="bg-[#CE2029] text-white font-black px-8 py-3.5 rounded-full hover:opacity-90 transition-all min-w-[120px] shadow-lg shadow-red-100 active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};