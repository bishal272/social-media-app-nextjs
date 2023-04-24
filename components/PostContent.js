import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";

export default function PostContent({ text, author, createdAt, _id }) {
  return (
    <div className="flex">
      <div className="">
        <Avatar src={author.image} />
      </div>
      <div className="pl-2">
        <div className="">
          <span className="font-bold">{author.name}</span>
          <span className="pl-1 text-twitterLightGray">@{author.username}</span>
          <span className="pl-1 text-twitterLightGray">
            <ReactTimeAgo date={createdAt} timeStyle="twitter" />
          </span>
        </div>
        <Link href={`/${author.username}/status/${_id}`} className="">
          {text}
        </Link>
      </div>
    </div>
  );
}
