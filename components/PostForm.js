import axios from "axios";
import { Knewave } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import useUserInfo from "../hooks/useUserInfo";
import styles from "../src/styles/postform.module.css";
import Avatar from "./Avatar";
import Upload from "./Upload";
const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});

const PostForm = ({ onPost, compact, parent }) => {
  const { userInfo, userInfoStatus } = useUserInfo();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  if (userInfoStatus === "loading") {
    return "";
  }
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      alert("No blank posting please 🙏");
      return;
    } else {
      await axios.post("/api/posts", { text, parent, images });
      setText("");
      setImages([]);
      if (onPost) {
        onPost();
      }
    }
  };
  const uploadImage = async (ev) => {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      data.append("post", files[0]);
      fetch("/api/upload", {
        method: "POST",
        body: data,
      }).then(async (response) => {
        const json = await response.json();
        const src = json;
        setImages((prev) => [...prev, src]);
        setIsUploading(false);
      });
    }
  };
  return (
    <form action="" className="mx-5" onSubmit={handlePostSubmit}>
      <div className={(compact ? "items-center" : "") + " flex"}>
        <Link href={`/${userInfo?.username}`}>
          <Avatar src={userInfo?.image} />
        </Link>
        <div className="grow pl-2">
          <Upload onUploadFinish={(src) => setImages((prev) => [...prev, src])}>
            {({ isUploading }) => (
              <div>
                {isUploading && "uploading"}
                {/* <textarea
                  className={
                    (compact ? "h-10 mt-1" : "h-14") +
                    " w-full p-2 bg-transparent text-twitterWhite focus:outline-none resize-none"
                  }
                  placeholder={compact ? "Tweet Your Reply" : "What's Happening"}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                /> */}
                <div className={styles.form_control}>
                  <input
                    className={`${styles.input} ${styles.input_alt}`}
                    placeholder={compact ? "Type something intelligent" : "What's Happening"}
                    required=""
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <span className={`${styles.input_border} ${styles.input_border_alt}`}></span>
                </div>

                <div className="flex -mx-2">
                  {images.length > 0 &&
                    images.map((image) => (
                      <div key={image} className="h-24 m-2">
                        <img src={image} alt="" className="h-24" />
                      </div>
                    ))}
                  {isUploading && (
                    <div className="h-24 w-24 m-2 bg-twitterBorder flex items-center justify-center">
                      <RingLoader size={29} color="#fff" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </Upload>

          {!compact && (
            <div className="text-right border-t flex justify-between border-twitterBorder pt-5 pb-1 ">
              <label
                className={`bg-twitterBlue cursor-pointer text-white px-3 py-1 text-sm rounded-full ${knewave.className}`}>
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
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>

                <input
                  type="file"
                  id="actual-btn"
                  hidden
                  accept=".jpg,.jpeg,.png"
                  onChange={uploadImage}
                />
              </label>
              {isUploading && <RingLoader size={29} color="#fff" />}

              <button
                className={`bg-twitterBlue text-white px-3 py-1 text-sm rounded-full ${knewave.className}`}>
                Post
              </button>
            </div>
          )}
        </div>
        {compact && (
          <div className="pl-2">
            <button
              className={`bg-twitterBlue text-white px-5 py-1 rounded-full ${knewave.className}`}>
              Reply
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default PostForm;
