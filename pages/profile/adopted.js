import GuardedPage from "@/components/GuardedPage";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { auth, firestore } from "@/services/firebase";
import Image from "next/image";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { useUserContext } from "@/services/userContext";
import Link from "next/link";
import {
  IconCircleCheck,
  IconCircleX,
  IconExternalLink,
} from "@tabler/icons-react";
import { IconCurrencyDollar } from "@tabler/icons-react";
import Head from "next/head";

export default function AdoptedTree() {
  const { userStore } = useUserStore();

  const [trees, loadingTrees] = useCollection(
    userStore?.email &&
    query(
      collection(firestore, "Trees"),
      where("adoptedBy", "==", doc(firestore, "Users", userStore.email))
    )
  );

  const putUpForAdoption = async (id) => {
    const confirmResult = window.confirm("Are you sure you want to put this tree up for adoption?");

    if (confirmResult) {
      const treeDocRef = doc(firestore, "Trees", id);
      const treeSnapshot = await getDoc(treeDocRef);
      const treeData = treeSnapshot.data();

      let updatedPrevOwners = [];

      if (treeData.prevOwner) {
        updatedPrevOwners = [...treeData.prevOwner, treeData.adoptedBy];
      } else {
        updatedPrevOwners = [treeData.adoptedBy];
      }

      await updateDoc(treeDocRef, {
        isAdopted: false,
        adoptedBy: "",
        prevOwner: updatedPrevOwners,
      });

      alert("Tree has been put up for Adoption");
    }
  };

  return (
    <GuardedPage>
      <Head>
        <title>My Trees</title>
      </Head>
      <Header title="Adopted Trees" />

      <div className="container mx-auto">
        {loadingTrees && <Loading />}
        <div className="grid grid-cols-1 px-4 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {/* {!trees && !loadingTrees && "No Results Found"} */}
          {trees &&
            userStore &&
            trees.docs.map((tree) => (
              <div key={tree.id}>
                <div className="w-full overflow-hidden duration-200 bg-gray-200 rounded-md min-h-80 aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Image
                    width={200}
                    height={320}
                    src={tree.data().imageUrl}
                    alt={tree.data().name}
                    className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between mt-4">
                    <div>
                      <h3 className="font-bold text-md text-base-content">
                        <div>{tree.data().name}</div>
                      </h3>
                      <p className="mt-1 text-sm text-base-content opacity-70">
                        {tree.data().species} &middot; {tree.data().type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-circle btn-md btn-error"
                        onClick={() => putUpForAdoption(tree.id)}
                      >
                        <IconCurrencyDollar />
                      </button>
                      <Link
                        href={`/tree/${tree.id}`}
                        className="btn btn-circle btn-md btn-primary"
                      >
                        <IconExternalLink />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </GuardedPage>
  );
}
