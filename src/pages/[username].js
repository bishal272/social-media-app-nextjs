import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import Cover from "../../components/Cover";
import Layout from "../../components/Layout";
import PostContent from "../../components/PostContent";
import TopNavLink from "../../components/TopNavLink";
import useUserInfo from "../../hooks/useUserInfo";

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;
  const [profileInfo, setProfileInfo] = useState();
  const [originalUserInfo, setOriginalUserInfo] = useState();
  const { userInfo } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if (!username) {
      return;
    }
    axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
      setOriginalUserInfo(response.data.user);
      setIsFollowing(!!response.data.follow);
    });
  }, [username]);
  useEffect(() => {
    if (!profileInfo?._id) {
      return;
    }
    axios.get("/api/posts?author=" + profileInfo._id).then((response) => {
      setPosts(response.data.posts);
      setPostsLikedByMe(response.data.idsLikedByMe);
    });
  }, [profileInfo]);
  const updateUserImage = (type, src) => {
    setProfileInfo((prev) => ({ ...prev, [type]: src }));
  };
  const isMyProfile = profileInfo?._id === userInfo?._id;

  const cancel = () => {
    setProfileInfo((prev) => {
      const { bio, name, username } = originalUserInfo;
      return { ...prev, bio, name, username };
    });
    setEditMode(false);
  };
  const updateProfile = async () => {
    const { bio, name, username } = profileInfo;
    const trimmedBio = bio.trim();
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();

    await axios.put("/api/profile", {
      trimmedBio,
      trimmedName,
      trimmedUsername,
    });
    setEditMode(false);
  };

  const toggleFollow = async () => {
    setIsFollowing((prev) => !prev);
    await axios.post("/api/followers", {
      destination: profileInfo?._id,
    });
  };
  return (
    <Layout>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2">
            <TopNavLink title={profileInfo.name} />
          </div>

          <Cover
            editable={isMyProfile}
            src={profileInfo.cover}
            onChange={(src) => {
              updateUserImage("cover", src);
            }}
          />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute -top-12 border-4 rounded-full border-black overflow-hidden">
                <Avatar
                  big
                  src={profileInfo.image}
                  editable={isMyProfile}
                  onChange={(src) => updateUserImage("image", src)}
                />
              </div>
            </div>
            <div className="p-2">
              {!isMyProfile && (
                <button
                  className={
                    (isFollowing ? "bg-twitterWhite text-black " : "bg-twitterBlue text-white ") +
                    "py-2 px-5 rounded-full "
                  }
                  onClick={toggleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
              {isMyProfile && (
                <div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-twitterBlue py-2 px-5 rounded-full text-white">
                      Edit Profile
                    </button>
                  )}
                  {editMode && (
                    <div>
                      <button
                        onClick={() => {
                          cancel();
                        }}
                        className="bg-twitterWhite py-2 px-5 rounded-full text-black mr-2">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateProfile();
                        }}
                        className="bg-twitterBlue py-2 px-5 rounded-full text-white">
                        Save Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 mt-2">
            {!editMode && <h1 className="font-bold text-xl leading-6">{profileInfo.name}</h1>}
            {editMode && (
              <div>
                <input
                  type="text"
                  value={profileInfo.name}
                  onChange={(e) => setProfileInfo((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-twitterBorder p-2 rounded-full mb-2"
                />
              </div>
            )}
            {!editMode && (
              <h2 className="text-twitterLightGray text-sm">@{profileInfo.username}</h2>
            )}
            {editMode && (
              <div>
                <input
                  type="text"
                  value={profileInfo.username}
                  onChange={(e) =>
                    setProfileInfo((prev) => ({ ...prev, username: e.target.value }))
                  }
                  className="bg-twitterBorder p-2 rounded-full mb-2"
                />
              </div>
            )}
            {!editMode && <div className="text-sm mt-2 mb-2">{profileInfo.bio}</div>}
            {editMode && (
              <div>
                <textarea
                  value={profileInfo.bio}
                  onChange={(e) => setProfileInfo((prev) => ({ ...prev, bio: e.target.value }))}
                  className="bg-twitterBorder p-2 rounded-2xl mb-2 w-full block"
                />
              </div>
            )}
          </div>
        </div>
      )}
      {posts?.length > 0 &&
        posts.map((post) => (
          <div className="p-5 border-t border-twitterBorder" key={post._id}>
            <PostContent {...post} likedByMe={postsLikedByMe.includes(post._id)} />
          </div>
        ))}
    </Layout>
  );
}
