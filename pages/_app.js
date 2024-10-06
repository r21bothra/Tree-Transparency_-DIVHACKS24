import "@/styles/globals.css";
import { UserContextProvider } from "@/services/userContext";
import Navbar from "@/components/Navbar";
import { auth, firestore } from "@/services/firebase";
import { useUserStore } from "@/store/user";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { IconTree } from "@tabler/icons-react";
import { IconTrees } from "@tabler/icons-react";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // const [loading, setLoading] = useState(false);

  const { setUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const email = user.email;
      const photoURL = user?.photoURL ? user.photoURL : undefined;
      const docRef = doc(firestore, "Users", email);

      getDoc(docRef)
        .then((res) => {
          setUser({ email, photoURL, ...res.data() });
        })
        .catch((err) => console.error(err));
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const handleStart = (url) => url !== router.asPath && setLoading(true);
  //   const handleComplete = (url) => url === router.asPath && setLoading(false);

  //   router.events.on("routeChangeStart", handleStart);
  //   router.events.on("routeChangeComplete", handleComplete);
  //   router.events.on("routeChangeError", handleComplete);

  //   return () => {
  //     router.events.off("routeChangeStart", handleStart);
  //     router.events.off("routeChangeComplete", handleComplete);
  //     router.events.off("routeChangeError", handleComplete);
  //   };
  // }, [router]);

  return (
    <ThemeProvider>
      <UserContextProvider>
        <main className="h-screen">
          <Navbar />
          {/* {loading ? <Loading /> : <Component {...pageProps} />} */}
          <Component {...pageProps} />
        </main>
      </UserContextProvider>
    </ThemeProvider>
  );
}

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <IconTrees className="h-auto w-[100px] animate-pulse text-primary" />
    </div>
  );
}
