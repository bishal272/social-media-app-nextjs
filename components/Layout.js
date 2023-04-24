export default function Layout({ children }) {
  return (
    <div className="mx-auto max-w-lg border-l border-r border-twitterBorder min-h-screen">
      {children}
    </div>
  );
}
