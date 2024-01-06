import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoStatus, setUserInfoStatus] = useState("loading");
  const { data: session, status } = useSession();
  const getUserFromSession = () => {
    if (status === "loading") {
      return "";
    }
    if (!session?.user?.id) {
      setUserInfoStatus("unauthenticated");
      return;
    }
    fetch("/api/users?id=" + session.user.id).then((response) => {
      response.json().then((json) => {
        setUserInfo(json.user);
        setUserInfoStatus("authenticated");
      });
    });
  };

  useEffect(() => {
    getUserFromSession();
  }, [status]);
  // * returns the user object and status of userinfo-"ready" or "loading"
  return { userInfo, setUserInfo, userInfoStatus };
}
