import {
  useDocumentDataOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
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

export default function Tree({
  id,
  name,
  imageUrl,
  createdAt,
  species,
  isVerified,
  ngo,
  coordinates,
  type,
  description,
  adoptedBy,
  verifiedBy,
  prevOwner,
  ipfsHash,
  transactionHash,
}) {
  const router = useRouter();

  const [ngoDoc, ngoLoading, ngoError] = useDocumentDataOnce(
    doc(firestore, "Users", ngo)
  );

  function unVerifyTree() {
    updateDoc(doc(firestore, "Trees", id), {
      isVerified: false,
      verifiedBy: null,
    });
  }

  return (
    <>
      <Head>
        <title>Plant Details</title>
      </Head>
      <div className="max-w-4xl px-4 pt-6 mx-auto">
        <nav className="mb-4">
          <div className="breadcrumbs">
            <ul>
              <li>
                <Link href="/tree/adopt">Trees</Link>
              </li>
              <li>{id}</li>
            </ul>
          </div>
        </nav>
        <div className="max-w-full prose prose-lg">
          <h1 className="flex gap-6 items-center">
            {name}

            <label htmlFor="qr-modal" className="group">
              <IconQrcode className="w-10 h-10 opacity-40 group-hover:opacity-100 duration-100" />
            </label>
          </h1>

          <p>{description}</p>

          <table>
            <tbody>
              <tr>
                <td>Species</td>
                <td>{species}</td>
              </tr>

              <tr>
                <td>Type</td>
                <td>{type}</td>
              </tr>

              <tr>
                <td>IPFS Hash</td>
                <td>
                  <Link href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}>
                    {ipfsHash}
                  </Link>
                </td>
              </tr>

              <tr>
                <td>Verified</td>
                <td>
                  {!isVerified ? (
                    <div className="gap-2 btn btn-sm btn-error">
                      <span>
                        <IconCircleX />
                      </span>
                      Unverified
                    </div>
                  ) : (
                    <button
                      onClick={() => unVerifyTree()}
                      className="gap-2 btn btn-sm btn-success"
                    >
                      <span>
                        <IconCircleCheck />
                      </span>
                      Verified
                    </button>
                  )}
                </td>
              </tr>

              {isVerified && (
                <tr>
                  <td>Verified By</td>
                  <td>{verifiedBy}</td>
                </tr>
              )}

              <tr>
                <td>Adopted By</td>
                <td>{!adoptedBy ? "Not Adopted" : adoptedBy}</td>
              </tr>

              <tr>
                <td>Previous Owners</td>
                <td>
                  {!prevOwner.length
                    ? "No Previous Owners"
                    : prevOwner.map((owner) => owner.id).join(", ")}
                </td>
              </tr>

              {ngo && (
                <tr>
                  <td>NGO</td>
                  <td>
                    <Link href={`/ngo/${ngo}`}>
                      {ngoLoading ? "Loading" : ngoDoc.username}
                    </Link>
                  </td>
                </tr>
              )}

              <tr>
                <td>Planted At</td>
                <td>{!createdAt ? "Not Available" : createdAt}</td>
              </tr>

              {transactionHash && (
                <tr>
                  <td>Transaciton Hash</td>
                  <td>
                    <div className="input-group">
                      <input
                        type="text"
                        value={transactionHash}
                        className="input input-bordered"
                      />
                      <button
                        className="btn btn-square"
                        onClick={() =>
                          navigator.clipboard.writeText(transactionHash)
                        }
                      >
                        <IconCopy />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {adoptedBy && (
                <tr>
                  <td>Growth Status</td>
                  <td>
                    <Link
                      href={`/tree/growth-track/${id}`}
                      className="btn btn-sm btn-accent"
                    >
                      <IconCirclePlus />
                      Track Growth
                    </Link>
                  </td>
                </tr>
                // <button
                //   className="btn btn-sm btn-success"
                //   onClick={() => trackGrowth(id)}
                // >
                //   <span>
                //     <IconCirclePlus />
                //   </span>
                //   Track Growth
                // </button>
              )}

              <tr>
                <td className="align-top">NFT</td>
                <td>
                  <img
                    className="w-48 h-80 rounded-xl"
                    src={imageUrl}
                    alt={name}
                  />
                </td>
              </tr>

              {coordinates && (
                <tr>
                  <td className="align-top">Coordinates</td>
                  <td>
                    <p>
                      {coordinates.latitude},{coordinates.longitude}
                    </p>
                    <iframe
                      src={`https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=15&output=embed`}
                    ></iframe>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <input type="checkbox" id="qr-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="flex flex-col items-center justify-center">
            <div className="p-2 bg-white">
              <QRCode id="qr-code" value={router.asPath} size={200} />
            </div>
          </div>
          <div className="modal-action">
            <button
              onClick={() => {
                const qrCodeURL = document
                  .getElementById("qr-code")
                  ?.toDataURL("image/png")
                  .replace("image/png", "image/octet-stream");
                let aEl = document.createElement("a");
                aEl.href = qrCodeURL;
                aEl.download = `tree_${id}.png`;
                document.body.appendChild(aEl);
                aEl.click();
                document.body.removeChild(aEl);
              }}
              className="btn btn-primary"
            >
              Download QR
            </button>
            <label htmlFor="qr-modal" className="btn">
              Close
            </label>
          </div>
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
  const createdAt = tree.data()?.createdAt?.toDate().toISOString() || "Date Not Available";


  return {
    props: {
      id: tree.id,
      ...tree.data(),
      adoptedBy,
      ngo,
      verifiedBy,
      prevOwner,
      createdAt
    },
  };
}
