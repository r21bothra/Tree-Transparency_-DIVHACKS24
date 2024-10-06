import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GuardedPage({ role, children }) {
  const { userStore } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    !userStore && router.push("/");
    if (role) userStore.role !== role && router.push("/");
  }, []);

  return <>{children}</>;
}
