import EditableImage from "./EditableImage";

export default function Avatar({ src, big, onChange, editable = false }) {
  const widthClass = big ? "w-24" : "w-12";
  return (
    <div className="overflow-hidden">
      <EditableImage
        type={"image"}
        src={src}
        onChange={onChange}
        editable={editable}
        className={"rounded-full overflow-hidden " + widthClass}
      />
    </div>
  );
}
