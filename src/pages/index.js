import axios from "axios";
import { signOut } from "next-auth/react";
import { Knewave } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import PostContent from "../../components/PostContent";
import PostForm from "../../components/PostForm";
import UsernameForm from "../../components/UsernameForm";
import useUserInfo from "../../hooks/useUserInfo";
import styles from "../styles/search.module.css";
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
    await signOut();
    setUserInfo(null);
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
      <div className="flex p-6  items-center justify-between" ref={refSearch}>
        <h1 className={`text-lg font-bold ${knewave.className} hidden max-md:flex`}>Ripple</h1>
        <div className="flex items-center">
          {userInfo && (
            <div className="flex gap-5">
              <Link
                className="px-3 py-1  rounded-full bg-twitterDarkGray hidden max-md:flex"
                href={"/people"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 w-5">
                  <path
                    fillRule="evenodd"
                    d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                    clipRule="evenodd"
                  />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
              </Link>
              <button
                onClick={logout}
                className="bg-twitterDarkGray text-white text-sm px-3 py-1 mr-5 rounded-full">
                Logout
              </button>
            </div>
          )}
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
            <div className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
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
      <div className="mt-2">
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
    </Layout>
  );
}
