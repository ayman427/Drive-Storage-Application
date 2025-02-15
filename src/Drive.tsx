import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

const Drive = () => {
  const [file, setFile] = useState<File | null>(null);
  const uploadFile = useMutation(api.files.uploadFile);
  const deleteFile = useMutation(api.files.deleteFile);
  const { user, isSignedIn } = useUser();
  const files = useQuery(api.files.getFilesForUser);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file || !isSignedIn || !user) return;

    const formData = new FormData();
    formData.append("file", file);

    const url = new URL("https://api.cloudinary.com/v1_1/dtr7kwhfq/upload");
    url.searchParams.append("upload_preset", "my_preset"); // Ensure this preset is whitelisted for unsigned uploads
    url.searchParams.append("api_key", "971969916724757"); // Double-check API key

    try {
      // Log the URL and formData before the request
      console.log("Uploading to Cloudinary with URL:", url.toString());

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error uploading file:", errorText);
        throw new Error(errorText); // Provide more details on the error
      }

      const result = await response.json();
      const fileUrl = result.secure_url; // This should be publicly accessible now

      // Log result to ensure fileUrl is correct
      console.log("File uploaded successfully. File URL:", fileUrl);

      // Upload the file URL to your database (or convex server)
      await uploadFile({
        user: user.primaryEmailAddress?.emailAddress || "unknown",
        fileName: file.name,
        fileUrl: fileUrl,
        uploadDate: new Date().toISOString(),
      });

      setFile(null); // Clear the file input after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an issue uploading your file. Please try again.");
    }
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile({ fileId });
  };

  const renderPreview = (fileUrl: string, fileName: string) => {
    const fileType = fileName.split(".").pop()?.toLowerCase();

    if (fileType?.match(/(jpg|jpeg|png|gif|webp)$/)) {
      return <img src={fileUrl} alt={fileName} className="w-full rounded-lg" />;
    } else if (fileType?.match(/(mp4|webm|ogg)$/)) {
      return (
        <video controls className="w-full rounded-lg">
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
      // Use a direct download link for PDF files
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          📄 {fileName}
        </a>
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Drive</h1>
      {isSignedIn ? (
        <>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-600"
          >
            Upload
          </button>

          <h2 className="text-2xl mb-4">Your Files:</h2>
          {files && files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  {renderPreview(file.fileUrl, file.fileName)}
                  <p className="mt-2 font-semibold">{file.fileName}</p>
                  <p className="text-gray-500 text-sm">
                    Uploaded on: {new Date(file.uploadDate).toLocaleString()}
                  </p>
                  <div className="mt-2 flex justify-between">
                    <a
                      href={file.fileUrl}
                      download={file.fileName}
                      className="text-green-500 hover:text-green-600"
                    >
                      ⬇️ Download
                    </a>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </>
      ) : (
        <p>Please log in to upload and view files.</p>
      )}
    </div>
  );
};

export default Drive;
