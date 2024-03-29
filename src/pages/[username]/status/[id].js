import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import PostContent from "../../../../components/PostContent";
import PostForm from "../../../../components/PostForm";
import TopNavLink from "../../../../components/TopNavLink";
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
      {!!post?._id && (
        <div className="px-8 py-6">
          <TopNavLink />
          {post.parent && (
            <div className="pb-1">
              <PostContent {...post.parent} />
              <div className="ml-5 h-12 relative">
                <div
                  className="h-20 border-l-2  border-twitterBorder absolute -top-5"
                  style={{ marginLeft: "2px" }}></div>
              </div>
            </div>
          )}
          <div>
            <PostContent {...post} big={true} />
          </div>
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder py-5">
          <PostForm onPost={fetchData} compact parent={id} />
        </div>
      )}
      <div className="">
        {replies.length > 0 &&
          replies.map((reply) => (
            <div className="p-5 border-t border-twitterBorder" key={reply._id}>
              <PostContent {...reply} likedByMe={repliesLikedByMe.includes(reply._id)} />
            </div>
          ))}
      </div>
    </Layout>
  );
}
