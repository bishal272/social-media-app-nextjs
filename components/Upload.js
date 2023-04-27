import { useState } from "react";
import { FileDrop } from "react-file-drop";

export default function Upload({ children, onUploadFinish }) {
  const [isFileNearBy, setIsFileNearBy] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = (files, ev) => {
    ev.preventDefault();
    setIsFileNearBy(false);
    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append("post", files[0]);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      const json = await response.json();
      const src = json;
      onUploadFinish(src);
      setIsUploading(false);
    });
  };
  return (
    <FileDrop
      onDrop={uploadImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearBy(true)}
      onFrameDragLeave={() => setIsFileNearBy(false)}
      onFrameDrop={() => {
        setIsFileNearBy(false);
        setIsFileOver(false);
      }}>
      <div className="relative">
        {(isFileNearBy || isFileOver) && (
          <div className="bg-twitterBlue absolute inset-0 flex justify-center items-center">
            Drop your Images here
          </div>
        )}
        {children({ isUploading })}
      </div>
    </FileDrop>
  );
}
