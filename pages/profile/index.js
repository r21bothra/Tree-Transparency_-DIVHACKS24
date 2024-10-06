import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Loading from "@/components/Loading";
import { firestore } from "@/services/firebase.js";
import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";
import GuardedPage from "@/components/GuardedPage";
import { IconEdit, IconPaperclip } from "@tabler/icons-react";
import Header from "@/components/Header";
import Head from "next/head";

export default function Profile() {
  const router = useRouter();

  const { user } = useUserContext();
  const { userStore, setUser } = useUserStore();

  const [loading, setLoading] = useState();

  useEffect(() => {
    const redirectToLogin = () => {
      router.push("/dashboard");
      return <Loading />;
    };

    user ? null : redirectToLogin();

    if (user) {
      setLoading(true);

      const docRef = doc(firestore, "Users", user.email);

      getDoc(docRef).then((docSnap) => {
        const user = docSnap.data();

        if (!docSnap.exists()) router.push("/profile/edit");

        // window.localStorage.setItem("userStore", JSON.stringify(userStore));
        setUser({ id: docSnap.id, ...user });
      });
    }
    setLoading(false);
  }, [user]);

  const profileFields = [
    {
      label: "Name",
      value: userStore?.username,
    },
    {
      label: "Type",
      value: userStore?.type,
    },
    {
      label: "Pin Code",
      value: userStore?.pinCode,
    },
    {
      label: "Phone",
      value: userStore?.phone,
    },
  ];

  const ngoProfileFields = [
    {
      label: "NGO Id",
      value: userStore?.ngoId,
    },
    {
      label: "NGO Address",
      value: userStore?.ngoAddress,
    },
  ];

  return (
    <>
    <Head>
        <title>Your Profile</title>
    </Head>
    <GuardedPage>
      <Header title="Profile" />
      {loading ? (
        <Loading />
      ) : (
        <div className="container px-4 py-6 mx-auto">
          <Link href="/profile/edit" className="flex justify-end w-full">
            <div className="btn btn-primary btn-circle">
              <IconEdit />
            </div>
          </Link>
          <ProfileInformationSection
            className="py-6"
            title="Your Profile"
            subtitle="Personal details and information."
          >
            {profileFields.map((field) => (
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-base-content">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm leading-6 opacity-80 sm:col-span-2 sm:mt-0">
                  {field.value}
                </dd>
              </div>
            ))}
          </ProfileInformationSection>
          {userStore?.type === "NGOs" && (
            <ProfileInformationSection
              className="py-6"
              title="Your NGO"
              subtitle="NGO details and information"
            >
              {ngoProfileFields.map((field) => (
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-base-content">
                    {field.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 opacity-80 sm:col-span-2 sm:mt-0">
                    {field.value}
                  </dd>
                </div>
              ))}
            </ProfileInformationSection>
          )}
        </div>
      )}
    </GuardedPage>
    </>
  );
}

export function ProfileInformationSection({
  title,
  subtitle,
  className,
  children,
}) {
  return (
    <div className={className}>
      <div className="px-4 sm:px-0">
        <h3 className="text-2xl font-semibold leading-7 text-base-content">
          {title}
        </h3>
        <p className="max-w-2xl mt-1 text-sm leading-6 opacity-70">
          {subtitle}
        </p>
      </div>
      <div className="mt-6 border-t border-base-content">
        <dl className="divide-y divide-base-content">{children}</dl>
      </div>
    </div>
  );
}
