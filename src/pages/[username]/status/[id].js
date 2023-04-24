import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import PostContent from "../../../../components/PostContent";
import PostForm from "../../../../components/PostForm";
import useUserInfo from "../../../../hooks/useUserInfo";

export default function PostPage() {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [replies, setReplies] = useState([]);
  const [repliesLikedByMe, setRepliesLikedByMe] = useState([]);

  const fetchData = () => {
    axios.get("/api/posts/?id=" + id).then((response) => {
      setPost(response.data.post);
      axios.get("/api/posts/?parent=" + id).then((response) => {
        setReplies(response.data.posts);
        setRepliesLikedByMe(response.data.idsLikedByMe);
      });
    });
  };
  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);
  return (
    <Layout>
      {post && (
        <div className="px-5 py-2">
          <Link href={"/"}>
            <div className="flex mb-5 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-3">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Tweet
            </div>
          </Link>
          <PostContent {...post} big={true} />
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder py-5">
          <PostForm onPost={fetchData} compact parent={id} />
        </div>
      )}
      <div className="">
        {replies.length > 0 &&
          replies.map((reply, index) => (
            <div className="p-5 border-t border-twitterBorder" key={index}>
              <PostContent {...reply} likedByMe={repliesLikedByMe.includes(reply._id)} />
            </div>
          ))}
      </div>
    </Layout>
  );
}
