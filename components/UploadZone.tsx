'use client';

import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
}

export default function UploadZone({ onFilesAccepted }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 5,
    onDrop: onFilesAccepted,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-500 text-sm">
        {isDragActive ? 'Drop images here…' : 'Drag & drop images, or click to select (max 5)'}
      </p>
    </div>
  );
}
