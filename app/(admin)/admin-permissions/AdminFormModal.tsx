"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Jost } from "next/font/google";
import { X, Camera, Check, RefreshCw, ChevronDown } from "lucide-react";
import Cropper from "react-easy-crop";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export interface AdminFormData {
  id?: number;
  avatar?: string | null;
  fullname: string;
  displayName: string;
  status: "Active" | "Inactive";
  email: string;
  phone: string;
  street: string;
  city: string;
  ward: string;
  password?: string;
  permissions: string[];
}

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: AdminFormData | null;
  onSubmit: (data: AdminFormData) => void;
}

const emptyForm: AdminFormData = {
  fullname: "",
  displayName: "",
  status: "Active",
  email: "",
  phone: "",
  street: "",
  city: "",
  ward: "",
  password: "",
  permissions: [],
};

const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
  const image = new window.Image();
  image.src = imageSrc;
  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No 2d context");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = (error) => reject(error);
  });
};

export default function AdminFormModal({ isOpen, onClose, mode, initialData, onSubmit }: AdminFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<AdminFormData>(emptyForm);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null); 
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); 
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData?.id) {
        userService.getUserById(initialData.id.toString())
          .then(res => {
            const u = res.data;
            setFormData({
              id: initialData.id,
              fullname: u.fullName || "",
              displayName: u.fullName || "",
              status: u.enabled ? "Active" : "Inactive",
              email: u.email || "",
              phone: u.phone || "",
              street: initialData.street || "",
              city: initialData.city || "",
              ward: initialData.ward || "",
              password: "",
              permissions: initialData.permissions || [],
            });
            setCurrentAvatar(u.avatarUrl || null);
          })
          .catch(console.error);
      } else {
        setFormData(emptyForm);
        setCurrentAvatar(null);
      }
    }
  }, [isOpen, mode, initialData]);

  const onCropComplete = useCallback((_: any, scrolledPixels: any) => {
    setCroppedAreaPixels(scrolledPixels);
  }, []);

  if (!isOpen) return null;

  const handleChange = (field: keyof AdminFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (perm: string) => {
    setFormData((prev) => {
      const perms = prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: perms };
    });
  };

  const handleToggleStatus = () => {
    handleChange("status", formData.status === "Active" ? "Inactive" : "Active");
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, avatar: currentAvatar });
    onClose();
  };

  const handleCameraButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl); 
    }
  };

  const handleConfirmCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        setCurrentAvatar(croppedImage); 
        setImageToCrop(null); 
        setZoom(1); 
        if (fileInputRef.current) fileInputRef.current.value = ""; 
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCancelCrop = () => {
    setImageToCrop(null);
    setZoom(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className={`${jost.className} fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !imageToCrop) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[800px] rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
        
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-black hover:text-gray-600 transition-colors z-10"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        <h2 className="text-[24px] font-bold text-black mb-8">
          {mode === "create" ? "Create Account Admin" : "Edit Account Admin"}
        </h2>

        <div className="flex flex-col md:flex-row items-start gap-10">
          
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <div className="w-[180px] h-[180px] rounded-full overflow-hidden bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400 border border-gray-100 flex items-center justify-center shadow-sm">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Admin Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
                  <rect width="88" height="88" fill="#F5A623" rx="44" />
                  <path d="M12 80 C12 62 28 54 44 54 C60 54 76 62 76 80" fill="#2563eb" />
                  <path d="M35 54 L44 64 L53 54" fill="#1e3a8a" />
                  <circle cx="44" cy="36" r="18" fill="#F5C67A" />
                  <path d="M26 30 C26 16 62 16 62 30 C62 22 56 16 44 16 C32 16 26 22 26 30Z" fill="#5c3a21" />
                </svg>
              )}
            </div>

            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

            <button 
              onClick={handleCameraButtonClick}
              className="absolute bottom-2 right-4 bg-white rounded-full p-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-gray-50 transition-transform hover:scale-110 active:scale-95"
            >
              <Camera size={22} className="text-black" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-4">
            
            <div className="grid grid-cols-[130px_1fr] items-center gap-4 text-[15px]">
              <span className="text-black">Fullname:</span>
              <input 
                value={formData.fullname}
                onChange={(e) => handleChange("fullname", e.target.value)}
                className="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-[130px_1fr] items-center gap-4 text-[15px]">
              <span className="text-black">Display name:</span>
              <input 
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                className="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-[130px_1fr] items-center gap-4 text-[15px]">
              <span className="text-black">Status:</span>
              <div className="flex items-center gap-3">
                <span className={`font-bold ${formData.status === "Active" ? "text-blue-700" : "text-gray-500"}`}>
                  {formData.status}
                </span>
                <button onClick={handleToggleStatus} className="text-black hover:rotate-180 transition-transform duration-300">
                  <RefreshCw size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[130px_1fr] items-center gap-4 text-[15px]">
              <span className="text-black">Email:</span>
              <input 
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={mode === "edit"}
                className={`w-max bg-transparent outline-none border-none underline underline-offset-4 placeholder:no-underline ${mode === "edit" ? "text-gray-500 cursor-not-allowed" : "text-black"}`}
                placeholder="Enter email..."
              />
            </div>

            <div className="grid grid-cols-[130px_1fr] items-center gap-4 text-[15px]">
              <span className="text-black">Phone number:</span>
              <input 
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-[130px_1fr] items-start gap-4 text-[15px] pt-1">
              <span className="text-black pt-2">Address:</span>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-[120px] text-right italic text-black">Street Address</span>
                  <input 
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    className="flex-1 border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="w-[120px] text-right italic text-black">Province/City</span>
                  <div className="relative flex-1">
                    <select 
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full appearance-none border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors bg-white cursor-pointer"
                    >
                      <option value="">Select City</option>
                      <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                      <option value="Ha Noi">Ha Noi</option>
                      <option value="Da Nang">Da Nang</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[120px] text-right italic text-black">Ward/Commune</span>
                  <div className="relative flex-1">
                    <select 
                      value={formData.ward}
                      onChange={(e) => handleChange("ward", e.target.value)}
                      className="w-full appearance-none border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors bg-white cursor-pointer"
                    >
                      <option value="">Select Ward</option>
                      <option value="Thu Duc Ward">Thu Duc Ward</option>
                      <option value="District 1">District 1</option>
                      <option value="District 2">District 2</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[130px_1fr] items-center gap-4 text-[15px] pt-1">
              <span className="text-black">Password:</span>
              <input 
                type="text"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-[130px_1fr] items-start gap-4 text-[15px] pt-3">
              <span className="text-[#CE2029] font-bold">Delegating control</span>
              <div className="grid grid-cols-2 gap-y-3">
                {["Auction", "Categories", "Feedback", "Permissions"].map((perm) => (
                  <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="w-[18px] h-[18px] border-black rounded-sm accent-[#CE2029] cursor-pointer" 
                    />
                    <span className="text-black group-hover:text-[#CE2029] transition-colors">{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={handleSubmit}
                className="bg-[#0000FF] text-white font-bold text-[16px] rounded-full px-14 py-3 hover:bg-blue-800 transition-all active:scale-95 shadow-md"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      </div>

      {imageToCrop && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-[900] tracking-tight text-gray-900">Edit Profile Picture</h3>
              <button onClick={handleCancelCrop} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="relative h-[400px] w-full bg-gray-900">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1} 
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-8 bg-white">
                <div className="mb-8">
                    <p className="text-xs font-black text-gray-400 tracking-widest mb-3">Zoom Level</p>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#d32f2f]"
                    />
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={handleCancelCrop}
                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all text-xs tracking-widest"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmCrop}
                        className="flex-1 px-6 py-4 rounded-2xl font-[900] text-white bg-[#d32f2f] hover:bg-red-700 shadow-xl shadow-red-100 transition-all flex items-center justify-center gap-2 text-xs tracking-widest"
                    >
                        <Check size={18} strokeWidth={3} /> Save Changes
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}