export default function Avatar({ src, big }) {
  const widthClass = big ? "w-24" : "w-12";
  return (
    <div className={"rounded-full overflow-hidden " + widthClass}>
      <img src={src} alt="avatar" />
    </div>
  );
}
