'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CardFile from "@/components/card_file";
import FileUploadButton from "@/components/FileUploadButton";

const supabaseUrl = 'https://yhmfuvfvjmbxkxyusvfo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlobWZ1dmZ2am1ieGt4eXVzdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyNzAzMDgsImV4cCI6MjAzMzg0NjMwOH0.ZDJecZnrgKWgOVygz58wN7TH8yzWfNCpaqYbpdbt4HY';
const supabase = createClient(supabaseUrl, supabaseKey);

const Home: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const setLoadingFunc = () => {
    setLoading(!loading);
  }
  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('areydoc').list();

    if (error) {
      console.error('Error fetching files:', error);
      setError('Failed to fetch files');
    } else {
      setFiles(data || []);
      console.log(data, 'Les files')
    }

    setLoading(false);
  };
  useEffect(() => {


    fetchFiles();
  }, []);



  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        LOADING ....
      </h1>
    </div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
      <div className="flex mb-5">
        <button className="flex items-center px-4 py-2 bg-red-400 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M580-280h80q25 0 42.5-17.5T720-340v-160h40v-60H660v-40h-80v40H480v60h40v160q0 25 17.5 42.5T580-280Zm0-220h80v160h-80v-160ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z" />
          </svg>
          My bucket
        </button>

        <div className="w-4"></div>
        <FileUploadButton updateUiState={fetchFiles} />
      </div>

      <div className="flex flex-wrap justify-start items-start w-screen justify-betwee">
        {files.length === 0 ? (
          <h3 className="text-4xl font-bold text-gray-800">
            No files found.
          </h3>
        ) : (
          files.map((file) => (
            <CardFile key={file.name} file={file} updateUiState={fetchFiles} />
          ))
        )}
      </div>
    </main>
  );
};

export default Home;
