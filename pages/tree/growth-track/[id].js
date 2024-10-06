import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { firestore, storage } from "@/services/firebase";
import {
  useDocumentDataOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { IconCircleCheck, IconCircleX, IconCopy } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { useUserContext } from "@/services/userContext";
import { IconQrcode } from "@tabler/icons-react";
import QRCode from "qrcode.react";
import Head from "next/head";
import { IconCirclePlus } from "@tabler/icons-react";
import { testResult } from "@/backend/result.js";

export default function Tree({
  id,
  name,
  imageUrl,
  species,
  isVerified,
  ngo,
  type,
  description,
  adoptedBy,
  verifiedBy,
  prevOwner,
  ipfsHash,
  transactionHash,
}) {
  const [ngoDoc, ngoLoading, ngoError] = useDocumentDataOnce(
    doc(firestore, "Users", ngo)
  );

  // Growth Track part
  const [treeImageUrl, setTreeImageUrl] = useState(imageUrl)
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [result, setResult] = useState(null);

  // const handleImage1Change = () => {
  //   setImage1(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  // };

  const handleImage2Change = (e) => {
    const file1 = e.target.files[0];
    setImage1(file1);
    console.log(file1);

    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage2(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const detectGrowth = async () => {
    // setResult(testResult);

    setResult(null);
    try {
      const formData = new FormData();
      // formData.append("file1", image1);
      const storageRef = ref(storage, `/planted/${id}`);
      const imageUrl = await getDownloadURL(storageRef);

      formData.append("url", imageUrl);
      formData.append("file2", image1);

      const response = await fetch("https://backendd-nnzp.onrender.com/detect_growth", {
        method: "POST",
        body: formData,
      });

      // Checking the response for growth
      if (response.ok) {
        const result = await response.json();


    const uploadTask = uploadBytesResumable(storageRef, image1);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(async (url) => {
          console.log(url);
          setTreeImageUrl(url)
          await updateDoc(doc(firestore, "Trees", id), {
            imageUrl: url,
          });
          alert("Updated Tree Image");
          })
          .catch((error) => {
            console.error(error);
          })
      }
    );
        console.log(result);
        // console.log(`Result from response ${result}`);
        setResult(result);
        console.log(
          result.growth_detected == "True"
            ? "Significant Growth Detected!"
            : "No Significant Growth Detected."
        );
        // alert(result.growth_detected == "True" ? "Significant Growth Detected!" : "No Significant Growth Detected.");
      } else {
        // alert("Failed to detect growth.");
        console.log("Failed to detect growth.");
      }
    } catch (error) {
      console.error("Error during growth detection:", error);
    }

    // Commenting for debugging
    // finally {
    //   setImage1(null);
    //   setImage2(null);
    // };
  };

  return (
    <>
      <Head>
        <title>Plant Growth Track</title>
      </Head>
      <div className="max-w-6xl px-4 pt-6 mx-auto">
        <nav className="mb-4">
          <div className="breadcrumbs">
            <ul>
              <li>Growth Track</li>
              <li>{id}</li>
            </ul>
          </div>
        </nav>
        <div className="max-w-full prose prose-lg">
          <h1 className="flex gap-6 items-center">{name}</h1>

          <table>
            <tbody>
              <tr>
                <td>IPFS Hash</td>
                <td>
                  <Link href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}>
                    {ipfsHash}
                  </Link>
                </td>
              </tr>

              {isVerified && (
                <tr>
                  <td>Verified By</td>
                  <td>{verifiedBy}</td>
                </tr>
              )}

              <tr>
                <td className="align-top">Previous Image</td>
                <td>
                  <img className="w-48 h-80" src={treeImageUrl} alt={name} />
                </td>
              </tr>

              <tr>
                <td className="align-top">Added Image</td>
                <td>
                  <input
                    className="w-1/3 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                    type="file"
                    id="image2"
                    accept="image/*"
                    onChange={handleImage2Change}
                  />
                  {image2 && (
                    <img
                      className="w-48 h-80 mt-2"
                      src={image2}
                      alt="Current Image"
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="max-w-lg p-3 mx-auto">
            <div className="flex items-center justify-center">
              <button
                onClick={detectGrowth}
                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline"
              >
                Detect Growth
              </button>
            </div>
          </div>

          {result && (
            <div className="container py-6 mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="table w-full table-compact">
                  <thead>
                    <tr>
                      <th className="text-center">Growth Detected</th>
                      <th className="text-center">Growth Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        {result.growth_detected === "True" ? (
                          <span className="text-green-500">
                            Significant Growth Detected!
                          </span>
                        ) : (
                          <span className="text-red-500">
                            No Significant Growth Detected
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        {result.mse && result.mse.toFixed(3)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full table-compact">
                  <thead>
                    <tr>
                      <th className="text-center">Mask of Image 1</th>
                      <th className="text-center">Mask of Image 2</th>
                      <th className="text-center">Difference Mask</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        {result.maskeda_thresh1 && (
                          <img
                            src={`data:image/png;base64,${result.maskeda_thresh1}`}
                            alt="Masked Image 1"
                            className="border mx-auto block"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        )}
                      </td>
                      <td className="text-center">
                        {result.maskeda_thresh2 && (
                          <img
                            src={`data:image/png;base64,${result.maskeda_thresh2}`}
                            alt="Masked Image 2"
                            className="border mx-auto block"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        )}
                      </td>
                      <td className="text-center">
                        {result.diff && (
                          <img
                            src={`data:image/png;base64,${result.diff}`}
                            alt="Difference Image"
                            className="border mx-auto block"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const tree = await getDoc(doc(firestore, "Trees", context.params.id));
  const adoptedBy = tree.data()?.adoptedBy?.id || "";
  const ngo = tree.data()?.ngo?.id || "";
  const verifiedBy = tree.data()?.verifiedBy?.id || "";
  const prevOwner =
    tree.data()?.prevOwner?.map((owner) => ({
      id: owner.id,
    })) || [];

  return {
    props: {
      id: tree.id,
      ...tree.data(),
      adoptedBy,
      ngo,
      verifiedBy,
      prevOwner,
      createdAt: tree.data()?.createdAt?.toDate().toISOString() || "Date Not Available",
    },
  };
}
