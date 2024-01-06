import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import FlipNumbers from "react-flip-numbers";

export default function PostButtons({
  username,
  id,
  commentCount,
  likeCount: likesCountDefault = 0,
  likedByMe: likedByMeDefault = false,
}) {
  const [likeCount, setLikeCount] = useState(likesCountDefault);
  const [likedByMe, setLikedByMe] = useState(likedByMeDefault);
  const toggleLike = async () => {
    const response = await axios.post("/api/like", { id });
    if (response.data?.like) {
      setLikeCount((prev) => prev + 1);
      setLikedByMe(true);
    } else {
      setLikeCount((prev) => prev - 1);
      setLikedByMe(false);
    }
  };
  const copyToClip = () => {
    // For mobile devices
    var text = `https://social-media-merkasin.vercel.app/${username}/status/${id}`;

    // Copy the text inside the text field
    navigator.clipboard.writeText(text);

    // Alert the copied text
    alert("Post link copied to clipboard 👌");
  };
  return (
    <div className="flex justify-between mr-12 text-twitterLightGray text-sm mt-1">
      <Link href={`/${username}/status/${id}`}>
        <div className="flex hover:text-blue-400 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-1 ">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <span>{commentCount}</span>
        </div>
      </Link>
      <button className="flex hover:text-green-400 hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1 ">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span>0</span>
      </button>
      <button
        className={
          (likedByMe ? "text-red-500 fill-red-500" : "") +
          " flex items-center hover:text-red-500 hover:scale-105"
        }
        onClick={toggleLike}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1 fill-inherit ">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span>
          <FlipNumbers
            height={12}
            width={12}
            play
            perspective={100}
            numbers={likeCount.toString()}
          />
        </span>
      </button>
      <button className="flex hover:text-orange-400 hover:scale-105" onClick={copyToClip}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1 ">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
          />
        </svg>
      </button>
    </div>
  );
}
