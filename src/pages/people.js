import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useUserInfo from "../../hooks/useUserInfo";

export default function People() {
  const { userInfo, setUserInfo, userInfoStatus } = useUserInfo();
  const [users, setUsers] = useState([]);
  const getUsers = () => {
    axios.get("/api/getUsers").then((response) => {
      setUsers(response.data.users);
    });
  };
  useEffect(() => {
    if (!userInfo) {
      return;
    }
    getUsers();
  }, [userInfo]);
  return (
    <Layout>
      {console.log(users)}
      {users.length > 0 &&
        users.map((user) => (
          <div key={user._id} className="border-t border-twitterBorder p-5 text-white">
            <Link href={`/${user.username}`} className="flex items-center gap-4">
              <div className="overflow-hidden rounded-full w-16 ">
                <img src={user.image} alt="" />
              </div>
              {user.name}
            </Link>
          </div>
        ))}
    </Layout>
  );
}
