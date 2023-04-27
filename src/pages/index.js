import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PostContent from "../../components/PostContent";
import PostForm from "../../components/PostForm";
import UsernameForm from "../../components/UsernameForm";
import useUserInfo from "../../hooks/useUserInfo";

export default function Home() {
  const { userInfo, setUserInfo, userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikedByMe] = useState([]);
  const router = useRouter();
  const fetchAllPosts = () => {
    axios.get("/api/posts").then((response) => {
      setPosts(response.data.posts);
      setIdsLikedByMe(response.data.idsLikedByMe);
    });
  };
  const logout = async () => {
    setUserInfo(null);
    await signOut();
  };
  useEffect(() => {
    fetchAllPosts();
  }, []);
  if (userInfoStatus === "loading") {
    return "loading user info..";
  }
  if (userInfo && !userInfo?.username) {
    return <UsernameForm />;
  }
  if (!userInfo) {
    router.push("/login");
    return "no user info";
  }
  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm onPost={() => fetchAllPosts()} />
      <div className="">
        {posts.length > 0 &&
          posts.map((post, index) => (
            <div key={index} className="border-t border-twitterBorder p-5">
              {post.parent && (
                <div>
                  <PostContent {...post.parent} />
                  <div className="relative h-8">
                    <div className="h-10 border-l-2  border-twitterBorder absolute ml-6 -top-4"></div>
                  </div>
                </div>
              )}
              <PostContent {...post} likedByMe={idsLikedByMe.includes(post._id)} />
            </div>
          ))}
      </div>
      {userInfo && (
        <div className="p-5 text-center border-twitterBorder border-t">
          <button onClick={logout} className="bg-twitterWhite text-black px-5 py-2 rounded-full">
            Logout
          </button>
        </div>
      )}
    </Layout>
  );
}
