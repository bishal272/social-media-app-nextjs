import UsernameForm from "../../components/UsernameForm";
import useUserInfo from "../../hooks/useUserInfo";

export default function Home() {
  const { userInfo, userInfoStatus } = useUserInfo();

  if (userInfoStatus === "loading") {
    return "loading user info..";
  }
  if (!userInfo?.username) {
    return <UsernameForm />;
  }
  return <div>Homepage logged in as {userInfo.username}</div>;
}
