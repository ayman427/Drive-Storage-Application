import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./components/ui/button";

const Drive = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [uploadProgress, setUploadProgress] = useState(0); // Progress state
  const uploadFile = useMutation(api.files.uploadFile);
  const deleteFile = useMutation(api.files.deleteFile);
  const renameFile = useMutation(api.files.renameFile); // Mutation to handle file renaming
  const { user, isSignedIn } = useUser();
  const files = useQuery(api.files.getFilesForUser);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !isSignedIn || !user) return;

    const formData = new FormData();
    formData.append("file", file);

    const url = new URL(import.meta.env.VITE_CLOUDINARY_URL);
    url.searchParams.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_PRESET
    );
    url.searchParams.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", url.toString(), true);

    // Update progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    });

    // Handle upload success
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const fileUrl = result.secure_url;

        await uploadFile({
          user: user.primaryEmailAddress?.emailAddress || "unknown",
          fileName: file.name,
          fileUrl: fileUrl,
          uploadDate: new Date().toISOString(),
        });

        setFile(null);
        setUploadProgress(0); // Reset progress
      } else {
        console.error("Error uploading file:", xhr.responseText);
        alert("There was an issue uploading your file. Please try again.");
      }
    };

    // Handle upload error
    xhr.onerror = () => {
      console.error("Error uploading file.");
      alert("There was an issue uploading your file. Please try again.");
    };

    // Send the request
    xhr.send(formData);
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile({ fileId }); // Close the menu after deletion
  };

  const handleRename = async (fileId: string, currentFileName: string) => {
    // Split the file name and extension
    const lastDotIndex = currentFileName.lastIndexOf("."); // Find the last dot in the file name
    const baseName =
      lastDotIndex === -1
        ? currentFileName
        : currentFileName.substring(0, lastDotIndex); // Get the base name
    const extension =
      lastDotIndex === -1 ? "" : currentFileName.substring(lastDotIndex + 1); // Get the extension

    const newName = prompt("Enter new file name:", baseName);
    if (newName) {
      // Ensure the extension remains the same while updating the base name
      const newFileName = extension ? `${newName}.${extension}` : newName; // If there's an extension, keep it, else just use the new name
      await renameFile({ fileId, newFileName }); // Call API to update the file name with the same extension
      console.log("File renamed to:", newFileName);
    }
  };

  const renderPreview = (fileUrl: string, fileName: string) => {
    const fileType = fileName.split(".").pop()?.toLowerCase();

    if (fileType?.match(/(jpg|jpeg|png|gif|webp)$/)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="w-full h-64 object-cover rounded-lg"
        />
      );
    } else if (fileType?.match(/(mp4|webm|ogg)$/)) {
      return (
        <video controls className="w-full h-64 rounded-lg">
          <source src={fileUrl} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType?.match(/(mp3|wav|ogg)$/)) {
      return (
        <audio controls>
          <source src={fileUrl} type={`audio/${fileType}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else if (fileType === "pdf") {
      return (
        <iframe
          src={fileUrl}
          title={fileName}
          className="w-full h-64 border rounded-lg"
          frameBorder="0"
        ></iframe>
      );
    } else {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          📁 {fileName}
        </a>
      );
    }
  };

  const filteredFiles =
    files?.filter((file) =>
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-black">
      <h1 className="text-4xl font-bold mb-6 text-center">My Drive</h1>
      {isSignedIn ? (
        <>
          <div
            className={`border-dashed border-2 rounded-lg p-6 mb-6 text-center ${isDragging ? "border-blue-600 bg-blue-50" : "border-gray-400"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <p className="text-lg">{file.name}</p>
            ) : (
              <p className="text-gray-600">
                Drag and drop a file here, or click to select one
              </p>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-blue-600 underline"
            >
              Browse Files
            </label>
          </div>

          {/* Display the progress bar when uploading */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-300 rounded-lg">
              <div
                className="bg-blue-600 h-2 rounded-lg"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            Upload
          </Button>

          <h2 className="font-bold text-2xl mt-6 mb-4 text-left">
            Your Files:
          </h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 rounded-lg px-4 py-2 mb-4 w-full dark:text-black"
          />

          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <div
                  key={file._id}
                  className="bg-white p-4 rounded-lg shadow-md dark:bg-filescard"
                >
                  {renderPreview(file.fileUrl, file.fileName)}
                  <p className="mt-2 text-sm text-gray-600 truncate">
                    {file.fileName}
                  </p>
                  <Button
                    className="mt-4 text-sm bg-red-600 text-white"
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    className="mt-2 text-sm bg-yellow-600 text-white"
                    onClick={() => handleRename(file._id, file.fileName)}
                  >
                    Rename
                  </Button>
                  <Button className="mt-2 text-sm bg-green-600 text-white">
                    <a href={file.fileUrl} download={file.fileName}>
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No files found.</p>
          )}
        </>
      ) : (
        <p className="text-center">Please sign in to access your drive.</p>
      )}
    </div>
  );
};

export default Drive;
