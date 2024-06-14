'use client';
import React, { useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
interface ChildProps {
    updateUiState: () => void;
}

const FileUploadButton: React.FC<ChildProps> = ({ updateUiState }) => {

    const supabase = createClient('https://yhmfuvfvjmbxkxyusvfo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlobWZ1dmZ2am1ieGt4eXVzdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyNzAzMDgsImV4cCI6MjAzMzg0NjMwOH0.ZDJecZnrgKWgOVygz58wN7TH8yzWfNCpaqYbpdbt4HY');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setSelectedFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const uploadFile = async (file: File | null) => {
        if (!file) {
            console.error('No file selected');
            alert('No file selected');
            return;
        }

        setUploading(true);

        const { data, error } = await supabase.storage
            .from('areydoc')
            .upload(file.name, file);

        if (error) {
            console.error('Error uploading file:', error);
            alert('❌ Failed to upload file: ' + error.message);
        } else {
            //alert('✅ File uploaded successfully');

            updateUiState()
            const fileData = {
                name: file.name,
                type: file.type,
                path: URL.createObjectURL(file)
            };
            const filesHistory = JSON.parse(localStorage.getItem('filesHistory') || '[]');
            filesHistory.push(fileData);
            localStorage.setItem('filesHistory', JSON.stringify(filesHistory));
            console.log('File uploaded successfully:', data);
        }

        setUploading(false);
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <button
                onClick={handleButtonClick}
                disabled={uploading}
                className={`flex items-center px-4 py-2 ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 space-x-4`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                </svg>
                {uploading ? 'Uploading...' : 'Upload File'}
            </button>
        </div>
    );
};

export default FileUploadButton;
