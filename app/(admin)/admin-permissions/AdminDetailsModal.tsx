"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Jost } from "next/font/google";
import { X, Camera, Pencil, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import { userService } from "@/services/userService";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

interface AdminData {
  id: number;
  displayName: string;
  creationDate: string;
  status: "Active" | "Inactive";
}

interface AdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminData | null;
  onEditClick: () => void;
}

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

export default function AdminDetailsModal({ isOpen, onClose, admin, onEditClick }: AdminDetailsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null); 
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); 
  const [realAdminData, setRealAdminData] = useState<any>(null);
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_: any, scrolledPixels: any) => {
    setCroppedAreaPixels(scrolledPixels);
  }, []);

  useEffect(() => {
    if (isOpen && admin?.id) {
      userService.getUserById(admin.id.toString())
        .then(res => {
          setRealAdminData(res.data);
          setCurrentAvatar(res.data.avatarUrl || null);
        })
        .catch(console.error);
    } else {
      setRealAdminData(null);
      setCurrentAvatar(null);
    }
  }, [isOpen, admin]);

  if (!isOpen || !admin) return null;

  const enriched = {
    fullName: realAdminData?.fullName || admin.displayName || "",
    email: realAdminData?.email || "N/A",
    phone: realAdminData?.phone || "N/A",
    address: "N/A",
    password: "***",
    ...admin,
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
        
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        
        await userService.updateProfile(undefined, undefined, file);

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
      <div className="bg-white w-full max-w-[800px] rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-black hover:text-gray-600 transition-colors z-10"
        >
          <X size={28} strokeWidth={2} />
        </button>

        <h2 className="text-[22px] font-bold text-black mb-8">Admin profile</h2>

        <div className="flex flex-col sm:flex-row items-start gap-10">
          
          <div className="relative flex-shrink-0">
            <div className="w-[160px] h-[160px] rounded-full overflow-hidden bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400 border border-gray-100 flex items-center justify-center">
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

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button 
              onClick={handleCameraButtonClick}
              className="absolute bottom-1 right-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 border border-gray-100 transition-transform hover:scale-110 active:scale-95"
            >
              <Camera size={20} className="text-black" />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-6 mb-2">
              <div>
                <h3 className="text-2xl font-bold text-black">{enriched.fullName}</h3>
                <p className="text-xl font-bold italic text-black">Admin</p>
              </div>
              <button 
                onClick={onEditClick}
                className="flex items-center gap-2 bg-[#e5e7eb] px-5 py-2 rounded-full font-medium text-black hover:bg-gray-300 transition-colors">
                <Pencil size={16} /> Edit
              </button>
            </div>

            <div className="grid grid-cols-[140px_1fr] gap-y-4 text-[16px]">
              <span className="text-black">Display name:</span>
              <span className="text-black">{enriched.displayName}</span>

              <span className="text-black">Status:</span>
              <span className="font-bold text-blue-700">{enriched.status}</span>

              <span className="text-black">Email:</span>
              <span className="text-black underline underline-offset-2">{enriched.email}</span>

              <span className="text-black">Phone number:</span>
              <span className="text-black">{enriched.phone}</span>

              <span className="text-black">Address:</span>
              <span className="text-black leading-snug">{enriched.address}</span>

              <span className="text-black">Creation date:</span>
              <span className="text-black">{enriched.creationDate}</span>

              <span className="text-black">Password:</span>
              <span className="text-black">{enriched.password}</span>

              <span className="text-[#CE2029] font-bold mt-1">Delegating control</span>
              <div className="flex flex-wrap items-center gap-5 mt-1">
                {["Auction", "Categories", "Feedback", "Permissions"].map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded-sm border-black accent-[#CE2029]" />
                    <span className="text-black">{perm}</span>
                  </label>
                ))}
              </div>
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