"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"], weight: ["400", "700", "900"] });

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  initialData: {
    fullname: string;
    email: string;
    phone: string;
    street: string;
    province: string;
    ward: string;
  };
}

export const EditProfileModal = ({ isOpen, onClose, onConfirm, initialData }: EditProfileModalProps) => {
  const [formData, setFormData] = useState(initialData);

  if (!isOpen) return null;

  const inputClass = "w-full border border-gray-300 rounded-full px-5 py-1.5 text-base outline-none focus:border-blue-600 transition-all font-medium text-gray-800";
  const labelClass = "text-lg font-bold text-gray-900 min-w-[130px]";
  const subLabelClass = "text-[15px] font-bold italic text-gray-900 min-w-[150px] text-right pr-4";

  return (
    <div className={`${jost.className} fixed inset-0 z-[100] flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-[750px] rounded-[35px] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-900 hover:scale-110 transition-transform">
            <X size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Fullname */}
          <div className="flex items-center gap-3">
            <label className={labelClass}>Fullname:</label>
            <input 
              type="text" 
              value={formData.fullname}
              onChange={(e) => setFormData({...formData, fullname: e.target.value})}
              className={inputClass} 
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <label className={labelClass}>Email:</label>
            <span className="text-base font-medium text-gray-900 underline px-2 italic">
              {formData.email}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <label className={labelClass}>Phone number:</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className={inputClass} 
            />
          </div>

          {/* Address Section */}
          <div className="space-y-4 pt-2">
            <label className="text-lg font-bold text-gray-900 block">Address:</label>
            
            <div className="flex items-center gap-3">
              <label className={subLabelClass}>Street Address</label>
              <input 
                type="text" 
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className={inputClass} 
              />
            </div>

            <div className="flex items-center gap-3">
              <label className={subLabelClass}>Province/City</label>
              <div className="relative w-full">
                <select className={`${inputClass} appearance-none cursor-pointer bg-transparent`}>
                  <option>{formData.province}</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={20} strokeWidth={3} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className={subLabelClass}>Ward/Commune</label>
              <div className="relative w-full">
                <select className={`${inputClass} appearance-none cursor-pointer bg-transparent`}>
                  <option>{formData.ward}</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={20} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => onConfirm(formData)}
            className="px-14 py-2.5 bg-blue-600 text-white text-xl font-black rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};