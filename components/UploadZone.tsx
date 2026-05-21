'use client';

import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  label?: string;
  dark?: boolean;
}

export default function UploadZone({
  onFilesAccepted,
  accept = { 'image/*': [] },
  maxFiles = 5,
  label,
  dark = false,
}: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    onDrop: onFilesAccepted,
  });

  const base = dark
    ? 'border-gray-600 hover:border-green-500 bg-white/5'
    : 'border-gray-300 hover:border-green-700 bg-white';
  const active = dark ? 'border-green-400 bg-green-900/30' : 'border-green-700 bg-green-50';
  const textColor = dark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? active : base
      }`}
    >
      <input {...getInputProps()} />
      <Upload size={22} className={`mx-auto mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
      <p className={`text-sm font-medium ${textColor}`}>
        {isDragActive
          ? 'Drop files here…'
          : label ?? `Drag & drop or click to select (max ${maxFiles})`}
      </p>
      <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
        {Object.keys(accept).includes('application/pdf')
          ? 'PDF, JPG, PNG accepted'
          : 'JPG, PNG accepted'}
      </p>
    </div>
  );
}

