import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import PostButtons from "./PostButtons";

export default function PostContent({
  text,
  author,
  createdAt,
  _id,
  likedByMe,
  likeCount,
  commentCount,
  images,
  big = false,
}) {
  const showImages = () => {
    if (!images?.length) {
      return "";
    }
    return (
      <div className="flex -mx-1">
        {images.length > 0 &&
          images.map((img) => (
            <div className="m-1" key={img}>
              <img src={img} alt="" />
            </div>
          ))}
      </div>
    );
  };
  return (
    <div>
      <div className="flex w-full">
        <div className="">
          <Link href={"/" + author?.username}>
            <div className="cursor-pointer">
              <Avatar src={author?.image} />
            </div>
          </Link>
        </div>
        <div className="pl-2 grow">
          <div className="">
            <Link href={"/" + author?.username}>
              <span className="font-bold pr-1 hover:underline">{author?.name}</span>
            </Link>
            {big && <br />}
            <Link href={"/" + author?.username}>
              <span className="text-twitterLightGray">@{author?.username}</span>
            </Link>
            <span className="pl-1 text-twitterLightGray text-sm">
              .{" "}
              {createdAt && !big && <ReactTimeAgo date={new Date(createdAt)} timeStyle="twitter" />}
            </span>
          </div>
          {!big && (
            <div>
              <Link href={`/${author?.username}/status/${_id}`} className="">
                <div className="w-full cursor-pointer">
                  {text}
                  {showImages()}
                </div>
              </Link>
              <PostButtons
                id={_id}
                username={author?.username}
                likeCount={likeCount}
                likedByMe={likedByMe}
                commentCount={commentCount}
              />
            </div>
          )}
        </div>
      </div>

      {big && (
        <div className="mt-2">
          <Link href={`/${author?.username}/status/${_id}`} className="">
            <div>
              {text}
              {showImages()}
            </div>
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
          <PostButtons
            id={_id}
            username={author?.username}
            likeCount={likeCount}
            likedByMe={likedByMe}
            commentCount={commentCount}
          />
        </div>
      )}
    </div>
  );
}
