import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import PostContent from "../../components/PostContent";
import PostForm from "../../components/PostForm";
import UsernameForm from "../../components/UsernameForm";
import useUserInfo from "../../hooks/useUserInfo";
import styles from "../styles/search.module.css";
import { Knewave } from "next/font/google";
const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const { userInfo, setUserInfo, userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikedByMe] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const refSearch = useRef();

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
  useEffect(() => {
    const handler = (e) => {
      if (refSearch && !refSearch.current.contains(e.target)) {
        setSearchMode(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  if (userInfoStatus === "loading") {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <img src="giphy.gif" alt="" className="h-72" />
      </div>
    );
  }
  if (userInfo && !userInfo?.username) {
    return <UsernameForm />;
  }
  if (!userInfo) {
    router.push("/login");
    return;
  }
  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      const searchedUsers = await axios.get("/api/search?searchItem=" + searchItem);
      setSearchItem("");
    }
  };
  return (
    <Layout>
      <div className="flex p-4 items-center justify-between" ref={refSearch}>
        <h1 className={`text-lg font-bold ${knewave.className}`}>Ripple</h1>
        <div className="flex items-center ">
          {/* {searchMode && (
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
              className={
                `w-6 h-6 ml-2 hover:text-twitterBlue ` + (searchMode && "text-twitterBlue")
              }>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>*/}
          <div className={styles.container}>
            <input
              type="text"
              name="text"
              className={styles.input}
              required=""
              placeholder="Search Name/@username"
              value={searchItem}
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
              onKeyDown={handleEnter}
            />
            <div class={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                <title>Search</title>
                <path
                  d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                  fill="none"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                  stroke-width="32"></path>
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="32"
                  d="M338.29 338.29L448 448"></path>
              </svg>
            </div>
          </div>
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
