import { firestore, storage } from "@/services/firebase";
import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { treeType } from "@/constants/tree-type";
import { treeSpecies } from "@/constants/tree-species";
import { treeContractAddress } from "@/constants/contract-address";
import TreeToken from "@/artifacts/contracts/TreeNFT.sol/TreeToken.json";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Head from "next/head";
import { useUserContext } from "@/services/userContext";

export default function TreeForm() {
  const { register, handleSubmit, reset } = useForm();
  const { user } = useUserContext();
  const [trees, setTrees] = useState([]);
  const [balance, setBalance] = useState();
  const [isSubmitting, setSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!window.ethereum) alert("Install Metamask") && router.push("/");

    connectToWallet();
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates(coords);
      },
      (err) => [console.log(err)]
    );
  };

  const connectToWallet = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  const getTrees = async () => {
    const treesRef = await getDocs(collection(firestore, "Trees"));

    const treesData = [];

    treesRef.forEach((snapshot) => {
      treesData.push(snapshot.data());
    });

    console.log(treesData);
    setTrees(treesData);
  };

  const handleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const response = await axios.post(url, formData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
      },
    });

    console.log(response);

    return response.data.IpfsHash;
  };

  const onSubmit = async (data) => {
    if (isSubmitting) {
      return;
    }
    setSubmitting(true);

    const { images, ...rest } = data;
    const image = images[0];

    // Push to IPFS
    const ipfsHash = await handleFile(image);
    console.log(ipfsHash);
    const metadataURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    // Mint token
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      treeContractAddress,
      TreeToken.abi,
      signer
    );
    const connection = contract.connect(signer);
    const result = await contract.mint(connection.address, metadataURI);
    const anotherResult = await result.wait();
    console.log(anotherResult);

    // Add to Firebase
    const treeRef = await addDoc(collection(firestore, "Trees"), {
      ...rest,
      ngo: doc(firestore, `Users/${user.email}`),
      ipfsHash,
      coordinates: {
        accuracy: coordinates.accuracy,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      transactionHash: result.hash,
      createdAt: serverTimestamp(),
      isVerified: false,
      isAdopted: false,
    });

    console.log(treeRef.id);

    const storageRef = ref(storage, `/planted/${treeRef.id}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (url) => {
            console.log(url);
            await updateDoc(doc(firestore, "Trees", treeRef.id), {
              imageUrl: url,
            });
            alert("Added Tree");
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setSubmitting(false);
            reset();
          });
      }
    );
  };

  return (
    <>
      <Head>
        <title>Add Trees</title>
      </Head>
      <div className="container py-6 mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md"
        >
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 font-bold text-gray-700"
            >
              Tree Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              {...register("name")}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block mb-2 font-bold text-gray-700"
            >
              Tree Description
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              {...register("description")}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="type"
              className="block mb-2 font-bold text-gray-700"
            >
              Tree Type
            </label>
            <select
              type="text"
              name="type"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              {...register("type")}
              required
            >
              {treeType.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="species"
              className="block mb-2 font-bold text-gray-700"
            >
              Tree species
            </label>
            <select
              type="text"
              name="species"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              {...register("species")}
              required
            >
              {treeSpecies.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="location"
              className="block mb-2 font-bold text-gray-700"
            >
              Location
            </label>
            <label className="block mb-2 font-bold">
              {coordinates && (
                <span>
                  <iframe
                    src={`https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=15&output=embed`}
                  ></iframe>
                </span>
              )}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              {...register("location")}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="images"
              className="block mb-2 font-bold text-gray-700"
            >
              Image
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              {...register("images")}
            />
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline"
              onClick={() => handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
