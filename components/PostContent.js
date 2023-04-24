import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import PostButtons from "./PostButtons";

export default function PostContent({ text, author, createdAt, _id, big = false }) {
  return (
    <div>
      <div className="flex w-full">
        <div className="">
          <Avatar src={author.image} />
        </div>
        <div className="pl-2 grow">
          <div className="">
            <span className="font-bold pr-1">{author.name}</span>
            {big && <br />}
            <span className="text-twitterLightGray">@{author.username}</span>
            <span className="pl-1 text-twitterLightGray">
              {!big && <ReactTimeAgo date={createdAt} timeStyle="twitter" />}
            </span>
          </div>
          {!big && (
            <div>
              <Link href={`/${author.username}/status/${_id}`} className="">
                {text}
              </Link>
              <PostButtons />
            </div>
          )}
        </div>
      </div>

      {big && (
        <div className="mt-2">
          <Link href={`/${author.username}/status/${_id}`} className="">
            {text}
          </Link>
          <div className="text-twitterLightGray text-sm">
            {new Date(createdAt)
              .toISOString()
              .replace("T", " ")
              .slice(0, 16)
              .split(" ")
              .reverse()
              .join(" ")}
          </div>
          <PostButtons />
        </div>
      )}
    </div>
  );
}
