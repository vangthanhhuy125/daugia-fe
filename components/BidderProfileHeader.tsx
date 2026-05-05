"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Camera, MessageSquare, Edit3, X, Check } from "lucide-react";
import Cropper from "react-easy-crop";

interface BidderProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl: string;
  bannerUrl: string;
  onFeedbackClick: () => void;
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

export const BidderProfileHeader = ({
  name,
  role,
  avatarUrl,
  bannerUrl,
  onFeedbackClick,
  onEditClick,
}: BidderProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl); 
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); 
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCameraButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl); 
    }
  };

  const onCropComplete = useCallback((_ : any, scrolledPixels: any) => {
    setCroppedAreaPixels(scrolledPixels);
  }, []);

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

  const handleCancel = () => {
    setImageToCrop(null);
    setZoom(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-[40px] shadow-[0_10px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-[900] tracking-tight text-gray-900">Edit Profile Picture</h3>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                        onClick={handleCancel}
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

      <div className="relative w-full h-48 md:h-64">
        <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
      </div>

      <div className="relative px-6 md:px-12 pb-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 md:-mt-24">
          <div className="relative">
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-[6px] border-white overflow-hidden bg-white shadow-2xl">
              <Image src={currentAvatar} alt="Avatar" fill className="object-cover" unoptimized />
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
              className="absolute bottom-4 right-2 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-all border border-gray-100 z-10"
            >
              <Camera size={18} className="text-gray-900" />
            </button>
          </div>

          <div className="flex-grow text-center md:text-left pb-2">
            <h2 className="text-2xl md:text-4xl font-[900] text-[#0f172a] tracking-tight">{name}</h2>
            <p className="text-xl font-[900] italic text-[#0f172a] mt-1">{role}</p>
          </div>

          <div className="flex gap-3 pb-2">
            <button onClick={onFeedbackClick} className="flex items-center gap-2 bg-[#ff0000] text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100">
              <MessageSquare size={18} fill="white" /> Feedback
            </button>
            <button onClick={onEditClick} className="flex items-center gap-2 bg-[#f1f5f9] text-[#0f172a] px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};