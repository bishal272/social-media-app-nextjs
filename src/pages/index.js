import axios from "axios";
import { useEffect, useState } from "react";
import PostContent from "../../components/PostContent";
import PostForm from "../../components/PostForm";
import UsernameForm from "../../components/UsernameForm";
import useUserInfo from "../../hooks/useUserInfo";

export default function Home() {
  const { userInfo, userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const fetchAllPosts = () => {
    axios.get("/api/posts").then((response) => {
      setPosts(response.data);
    });
  };
  useEffect(() => {
    fetchAllPosts();
  }, []);
  if (userInfoStatus === "loading") {
    return "loading user info..";
  }
  if (!userInfo?.username) {
    return <UsernameForm />;
  }

  return (
    <div className="mx-auto max-w-lg border-l border-r border-twitterBorder min-h-screen">
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm onPost={() => fetchAllPosts()} />
      <div className="">
        {posts.length > 0 &&
          posts.map((post, index) => (
            <div key={index} className="border-t border-twitterBorder p-5">
              <PostContent {...post} />
            </div>
          ))}
      </div>
    </div>
  );
}
