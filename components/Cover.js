import { useState } from "react";
import { FileDrop } from "react-file-drop";

export default function Cover() {
  const [isFileNearBy, setIsFileNearBy] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let extraClasses = "";
  if (isFileNearBy && !isFileOver) {
    extraClasses += " bg-white";
  }
  if (isFileOver) {
    extraClasses += " bg-blue-500";
  }
  const updateImage = (files, ev) => {
    ev.preventDefault();
    setIsFileNearBy(false);
    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append("cover", files[0]);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(() => {
      setIsUploading(false);
    });
  };
  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearBy(true)}
      onFrameDragLeave={() => setIsFileNearBy(false)}>
      <div className={"h-36 bg-twitterBorder" + extraClasses}>{isUploading ? "upload" : ""}</div>
    </FileDrop>
  );
}
