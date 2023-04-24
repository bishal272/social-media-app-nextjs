import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import PostContent from "../../../../components/PostContent";
import PostForm from "../../../../components/PostForm";
import useUserInfo from "../../../../hooks/useUserInfo";
import TopNavLink from "../../../../components/TopNavLink";

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
          <TopNavLink />
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
