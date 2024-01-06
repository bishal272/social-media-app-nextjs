import { getProviders, signIn, useSession } from "next-auth/react";
import { Knewave } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";
const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});
const LoginPage = ({ providers }) => {
  const { data, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <img src="giphy.gif" alt="" className="h-72" />
      </div>
    );
  }
  if (data) {
    router.push("/");
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center -mt-24">
        {Object.values(providers).map((provider) => (
          <div key={provider.id}>
            <h1 className={`text-3xl  pb-6 text-center ${knewave.className} font-sans`}>
              Welcome to Ripple
            </h1>
            <div className="w-full">
              <button
                onClick={async () => {
                  await signIn(provider.id);
                }}
                className="bg-twitterWhite text-black pl-2 pr-3 py-2 mx-auto rounded-full flex items-center justify-center">
                <Image
                  src="/google.svg"
                  alt=""
                  srcSet="google.png"
                  width="20"
                  height="32"
                  className="mx-2 "
                />
                Sign in with {provider.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute w-full bottom-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#0099ff"
            fill-opacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,181.3C384,160,480,96,576,101.3C672,107,768,181,864,208C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>{" "}
      <h2 className="text-center absolute bottom-0">developed by bishal</h2>
    </div>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default LoginPage;
