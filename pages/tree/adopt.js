import { useEffect, useState } from "react";
import {
  getDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { ethers } from "ethers";
import { firestore } from "@/services/firebase";
import { useUserContext } from "@/services/userContext";
import TreeToken from "@/artifacts/contracts/TreeNFT.sol/TreeToken.json";
import Link from "next/link";
import { treeContractAddress } from "@/constants/contract-address";
import Head from "next/head";
import Image from "next/image";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import Loading from "@/components/Loading";
import { IconExternalLink, IconSearch, IconFilter} from "@tabler/icons-react";
import TreeCard from "@/components/TreeCard";

export default function () {
  const [trees, loadingTrees, errorTrees, reloadTrees] = useCollectionOnce(
    collection(firestore, "Trees")
  );

  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");

  const adoptTree = async (id) => {
    const treeDocRef = doc(firestore, "Trees", id);
    const treeSnapshot = await getDoc(treeDocRef);
    const treeData = treeSnapshot.data();

    const prevOwner = treeData?.prevOwner || [];
    const prevOwnerEmails = prevOwner.map(reference => reference.id);

    if (prevOwnerEmails.includes(user.email)) {
      alert("You had previously adopted this tree");
    } else {
      await updateDoc(treeDocRef, {
        isAdopted: true,
        adoptedBy: doc(firestore, `Users/${user.email}`),
      });
      reloadTrees();
      alert("Adopted Tree");
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setAgeFilter(event.target.value);
  };

  const handleSpeciesFilterChange = (event) => {
    setSpeciesFilter(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Adopt Trees</title>
      </Head>
      <div className="container py-6 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-center items-center">
        <div class="relative">
  <input
    class="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-green-600 focus:border-green-600 focus:shadow-outline"
    id="username"
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={handleSearch}
  />
  <div class="absolute right-0 inset-y-0 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="-ml-1 mr-3 h-5 w-5 text-gray-400 hover:text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </div>

  <div class="absolute left-2 opacity-50 inset-y-0 flex items-center">
  <IconSearch />
  
  </div>
</div>
         
          <div className="flex justify-between items-center gap-4 px-6 ">
            <select
              className="border border-gray-300 px-4 py-2 ml-6 rounded-md  focus:ring focus:ring-green-200"
              value={ageFilter}
              onChange={handleFilterChange}
            >
              <option value="">Select Age</option>
              {[...Array(10).keys()].map(year => (
                <option key={year + 1} value={year + 1}>{year + 1} year{year === 0 ? '' : 's'} old</option>
              ))}
              <option value="10+">10+ years old</option>
            </select>
            <select
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-200"
              value={speciesFilter}
              onChange={handleSpeciesFilterChange}
            >
              <option value="">Select Species</option>
              <option value="Medicinal Plant">Medicinal Plant</option>
              <option value="Fruit Plant">Fruit Plant</option>
              <option value="Shrubs">Shrubs</option>
            </select>
            <IconFilter />
          </div>
        </div>
        {loadingTrees ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {errorTrees && <strong>Error: {JSON.stringify(error)}</strong>}
            {trees &&
              trees.docs
                // // .filter((tree) => {
                // //   const treeData = tree.data();
                // //   const nameMatch = treeData.name.toLowerCase().includes(searchQuery.toLowerCase());
                // //   const ageMatch = !ageFilter || (ageFilter === "10+" && treeData.createdAt && Date.now() - treeData.createdAt.toMillis() >= 10 * 365 * 24 * 60 * 60 * 1000) || (ageFilter !== "10+" && treeData.createdAt && Date.now() - treeData.createdAt.toMillis() < (parseInt(ageFilter) * 365 * 24 * 60 * 60 * 1000) && Date.now() - treeData.createdAt.toMillis() >= ((parseInt(ageFilter) - 1) * 365 * 24 * 60 * 60 * 1000));
                // //   const speciesMatch = !speciesFilter || treeData.species === speciesFilter;
                // //   return nameMatch && ageMatch && speciesMatch && !treeData.adoptedBy && treeData.isVerified;
                // })
                .map((tree) => (
                  <div key={tree.id}>
                    {/* Tree Card Component can be used for better code structure */}
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
                        <div>
                          <Link
                            href={`/tree/${tree.id}`}
                            className="btn btn-circle btn-md"
                          >
                            <IconExternalLink />
                          </Link>
                        </div>
                      </div>
                      {tree.data().adoptedBy ? (
                        <button className="btn" disabled>
                          Adopted
                        </button>
                      ) : (
                        <button
                          onClick={() => adoptTree(tree.id)}
                          className="btn btn-primary"
                        >
                          Adopt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </>
  );
}
