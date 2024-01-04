import "@/styles/globals.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Ripple</title>
        <link rel="icon" type="image/svg+xml" href="/wave.svg" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
