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
          {editable && (
            <button
              className={`bg-twitterBlue text-white px-1  rounded-full absolute right-0 bottom-5`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </FileDrop>
  );
}
