import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const getUserFromSession = () => {
    if (status === "loading") {
      return "";
    }
    fetch("/api/users?id=" + session.user.id);
  };
  useEffect(() => {
    getUserFromSession();
  }, [status]);
  return <div>test</div>;
}
