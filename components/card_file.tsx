'use client';
import React, { useRef, useState } from 'react';
import { FileDto } from '../dto/FileDto';
import { createClient } from '@supabase/supabase-js';

interface FileComponentProps {
    file: FileDto;
    updateUiState: () => void;
}

const formatDateFromString = (dateString: string): string => {
    const date = new Date(dateString);


    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };

    // Formater la date en utilisant les options
    return date.toLocaleDateString('en-US', options);
};
const findFilePathByName = (fileName: string): string | null => {
    const filesHistory = JSON.parse(localStorage.getItem('filesHistory') || '[]');
    const file = filesHistory.find((file: { name: string }) => file.name === fileName);
    console.log(file, 'FICHIER RETROUVÉ');
    return file ? file.path : null;
};
const openFileInNewTab = (filePath: string | null) => {
    if (filePath != null) {
        window.open(filePath, '_blank');
    }

};
const CardFile: React.FC<FileComponentProps> = ({ file, updateUiState }) => {
    const supabase = createClient('https://yhmfuvfvjmbxkxyusvfo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlobWZ1dmZ2am1ieGt4eXVzdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyNzAzMDgsImV4cCI6MjAzMzg0NjMwOH0.ZDJecZnrgKWgOVygz58wN7TH8yzWfNCpaqYbpdbt4HY');

    const deleteFile = async () => {
        try {
            const { error } = await supabase.storage.from('areydoc').remove([file.name]);

            if (error) {
                alert('❌ Failed to delete file: ' + error);
                throw error;
            }

            console.log(`File ${file.name} deleted successfully.`);
            updateUiState()

        } catch (error) {
            console.error('Error deleting file:', error);
            alert('❌ Failed to delete file: ' + error);
        }
    };
    return (

        <div className="m-4 max-w-md mx-auto bg-white rounded-xl shadow-md hover:drop-shadow-2xl overflow-hidden md:max-w-2xl  ">
            <div className="md:flex">
                <div className="p-3 pl-4">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" /></svg>

                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold flex justify-center items-center list-disc text-[13px]">

                        {file.name}
                    </div>
                    <ul className="list-disc text-[12px]" >
                        <li className='flex' ><div className="font-bold" >Date: </div> {formatDateFromString(file.updated_at)}</li>
                        <li className='flex'> <div className="font-bold" >Size: </div>  {file.metadata.size} KB</li>
                        <li className='flex'><div className="font-bold" >Type: </div> {file.metadata.mimetype}</li>
                    </ul>
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="w-200 flex">
                    <a onClick={() => openFileInNewTab(findFilePathByName(file.name))} href="#" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-500 hover:bg-blue-300 hover:text-gray-700 focus:outline-none focus:bg-gray-300">
                        <div className="flex justify-center items-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0267FF"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                            Display
                        </div>
                    </a>
                    <div className='w-2'></div>
                    <a onClick={deleteFile} href="#" className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-red-500 hover:bg-red-300 hover:text-gray-700 focus:outline-none focus:bg-gray-300">
                        <div className="flex justify-center items-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F87389"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                            Delete
                        </div>
                    </a>
                </div>

            </div>
        </div>

    );
};

export default CardFile;