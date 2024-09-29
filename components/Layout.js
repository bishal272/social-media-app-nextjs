import LeftPane from "./LeftPane";
import RightPane from "./RightPane";

export default function Layout({ children }) {
  return (
    <div className="flex justify-center gap-24">
      <div className="max-md:hidden">
        <LeftPane />
      </div>
      <div className=" max-md:max-w-md max-w-3xl border-l border-r border-twitterBorder min-h-screen">
        {children}
      </div>
      <div className="max-md:hidden">
        <RightPane />
      </div>
    </div>
  );
}
