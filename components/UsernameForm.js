import { useEffect, useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import { useRouter } from "next/router";

const UsernameForm = () => {
  const { userInfo, userInfoStatus } = useUserInfo();
  const [username, setUsername] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (userInfoStatus === "loading") {
      return;
    }
    if (username === "") {
      const defaultUsername = userInfo?.email?.split("@")[0];
      setUsername(defaultUsername);
    }
  }, [userInfoStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username }),
    });
    router.reload();
  };

  if (userInfoStatus === "loading") {
    return "";
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <form className="text-center" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-2">Pick a username</h2>
        <input
          type="text"
          className="mb-1 px-3 py-1 rounded-full bg-twitterBorder"
          placeholder="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-twitterBlue block w-full rounded-full py-1">Continue</button>
      </form>
    </div>
  );
};

export default UsernameForm;
