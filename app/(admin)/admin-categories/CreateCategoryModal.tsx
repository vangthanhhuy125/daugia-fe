import { X } from "lucide-react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCategoryModal = ({ isOpen, onClose }: CreateModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-8 top-8 text-black hover:scale-110 transition-transform">
          <X size={32} strokeWidth={2.5} />
        </button>
        
        <h3 className="text-2xl font-black mb-6 text-gray-900">Create New Category</h3>
        
        <div className="space-y-5">
          <div>
            <label className="block font-bold mb-2 text-gray-800">
              Category name <span className="text-red-600">(*)</span>:
            </label>
            <input 
              type="text" 
              placeholder="Enter category name..."
              className="w-full border-2 border-dashed border-gray-300 rounded-full py-3 px-6 outline-none focus:border-blue-600 focus:bg-blue-50/30 transition-all" 
            />
          </div>
          
          <div>
            <label className="block font-bold mb-2 text-gray-800">Description:</label>
            <textarea 
              placeholder="Enter description..."
              className="w-full border-2 border-dashed border-gray-300 rounded-[30px] py-4 px-6 h-40 outline-none focus:border-blue-600 focus:bg-blue-50/30 transition-all resize-none" 
            />
          </div>
          
          <div className="flex justify-center pt-4">
            <button className="bg-blue-600 text-white font-black px-14 py-3.5 rounded-full hover:bg-blue-700 transition-all text-lg shadow-lg shadow-blue-200 active:scale-95">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};