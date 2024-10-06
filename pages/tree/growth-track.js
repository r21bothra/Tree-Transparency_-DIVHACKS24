import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
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
import { IconExternalLink } from "@tabler/icons-react";
import TreeCard from "@/components/TreeCard";

//Testing purposes
import { testResult } from "@/backend/result.js"

export default function () {
  //To Do: Fetch image from firebase

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [result, setResult] = useState(null);

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    setImage1(file);
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    setImage2(file);
  };

  const detectGrowth = async () => {
    // setResult(testResult);
    
    setResult(null)
    try {
      const formData = new FormData();
      formData.append("file1", image1);
      formData.append("file2", image2);

      const response = await fetch("https://backendd-nnzp.onrender.com/detect_growth", {
        method: "POST",
        body: formData,
      });

      // Checking the response for growth
      if (response.ok) {
        const result = await response.json();
        console.log(result)
        // console.log(`Result from response ${result}`);
        setResult(result);
        console.log(result.growth_detected == "True" ? "Significant Growth Detected!" : "No Significant Growth Detected.");
        // alert(result.growth_detected == "True" ? "Significant Growth Detected!" : "No Significant Growth Detected.");
      } else {
        // alert("Failed to detect growth.");
        console.log("Failed to detect growth.");
      }
    } catch (error) {
      console.error("Error during growth detection:", error);
    }

    // Commenting for debugging
     finally {
      setImage1(null);
      setImage2(null);
    };
  };

  return (
    <>
      <Head>
        <title>Growth Track</title>
      </Head>
      <div className="container mx-auto space-y-2 px-2 sm:px-4 lg:px-6">
        <div className="max-w-lg p-3 mx-auto bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <label htmlFor="image1" className="block mb-2 font-bold text-gray-700">
              Upload Image 1:
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              type="file"
              id="image1"
              accept="image/*"
              onChange={handleImage1Change}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="image2" className="block mb-2 font-bold text-gray-700">
              Upload Image 2:
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              type="file"
              id="image2"
              accept="image/*"
              onChange={handleImage2Change}
            />
          </div>
          <div className="flex items-center justify-center mt-6">
            <button onClick={detectGrowth} className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline">
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
                        <span className="text-green-500">Significant Growth Detected!</span>
                      ) : (
                        <span className="text-red-500">No Significant Growth Detected</span>
                      )}
                    </td>
                    <td className="text-center">{result.mse && result.mse.toFixed(3)}</td>
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
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                    </td>
                    <td className="text-center">
                      {result.maskeda_thresh2 && (
                        <img
                          src={`data:image/png;base64,${result.maskeda_thresh2}`}
                          alt="Masked Image 2"
                          className="border mx-auto block"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                    </td>
                    <td className="text-center">
                      {result.diff && (
                        <img
                          src={`data:image/png;base64,${result.diff}`}
                          alt="Difference Image"
                          className="border mx-auto block"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
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
    </>
  );
}
