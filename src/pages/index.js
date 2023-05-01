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
  const [searchMode, setSearchMode] = useState(false);
  const [searchItem, setSearchItem] = useState("");

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
    if (!userInfo) {
      return;
    }
    fetchAllPosts();
  }, [userInfo]);

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
  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      const searchedUsers = await axios.get("/api/search?searchItem=" + searchItem);
    }
  };
  return (
    <Layout>
      <div className="flex p-4 items-center justify-between">
        <h1 className="text-lg font-bold ">Home</h1>
        <div className="flex items-center ">
          {searchMode && (
            <input
              type="text"
              className=" w-60 py-[2px]  px-4 rounded-2xl bg-twitterBorder"
              placeholder="Search Name or @username"
              value={searchItem}
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
              onKeyDown={handleEnter}
            />
          )}

          <button
            onClick={() => {
              setSearchMode((prev) => !prev);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </div>
      <PostForm
        onPost={() => {
          fetchAllPosts();
        }}
      />
      <div className="">
        {posts.length > 0 &&
          posts.map((post) => (
            <div key={post._id} className="border-t border-twitterBorder p-5">
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
