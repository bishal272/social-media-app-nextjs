import { useState } from "react";
import { FileDrop } from "react-file-drop";
import { RingLoader } from "react-spinners";

export default function EditableImage({ type, src, onChange, className, editable = false }) {
  const [isFileNearBy, setIsFileNearBy] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let extraClasses = "";
  if (isFileNearBy && !isFileOver) {
    extraClasses += " bg-blue-500 opacity-40";
  }
  if (isFileOver) {
    extraClasses += " bg-blue-500 opacity-90";
  }
  if (!editable) {
    extraClasses = "";
  }
  const updateImage = (files, ev) => {
    if (!editable) {
      return;
    }
    ev.preventDefault();
    setIsFileNearBy(false);
    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append(type, files[0]);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      const json = await response.json();
      onChange(json);
      setIsUploading(false);
    });
  };
  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearBy(true)}
      onFrameDragLeave={() => setIsFileNearBy(false)}
      onFrameDrop={() => {
        setIsFileNearBy(false);
        setIsFileOver(false);
      }}>
      <div className={"relative bg-twitterBorder"}>
        <div className={"absolute inset-0" + extraClasses}></div>
        {isUploading && (
          <div
            className="absolute inset-0 flex justify-center items-center"
            style={{ backgroundColor: "rgba(48,140,216,0.9)" }}>
            <RingLoader size={29} color="#fff" />
          </div>
        )}

        <div className={"cover flex items-center overflow-hidden " + className}>
          {src && <img src={src} alt="" className="w-full" />}
        </div>
      </div>
    </FileDrop>
  );
}
