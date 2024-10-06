import Head from "next/head";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../services/firebase.js";
import { firestore } from "../services/firebase.js";
import { useUserContext } from "../services/userContext.js";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { transactionDataContractAddress } from "@/constants/contract-address.js";
import TransactionData from "../artifacts/contracts/transact.sol/TransactionData.json";
import { IconCopy } from "@tabler/icons-react";

export default function pay() {
  const [org, setOrg] = useState("");
  const [amount, setAmount] = useState(0);
  const [paySuccess, setPaySuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");
  let web3;
  const [transactionHash, setTransactionHash] = useState("");
  const { user } = useUserContext();
  const [orgs, setOrgs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchNGO();
  }, []);

  function fetchNGO() {
    const docRef = collection(firestore, "Users");
    const q = query(docRef, where("type", "==", "NGOs"));
    getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const { username, ngoId } = doc.data();
          // console.log(doc.data())
          setOrgs((prevOrgs) => {
            const newOrg = { id: doc.id, username, ngoId };
            if (prevOrgs.some((org) => org.id === newOrg.id)) {
              return prevOrgs; // Element already exists, return previous state
            } else {
              return [...prevOrgs, newOrg]; // Add new element to the array
            }
          });
          console.log(orgs);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function validateFormWithJS() {
    const amount = document.getElementById("amount").value;

    if (!amount) {
      alert("Please enter Amount.");
      return false;
    }
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const addToChain = async (value) => {
    // Create Contract
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const balance = await provider.getBalance(account);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      transactionDataContractAddress,
      TransactionData.abi,
      signer
    );

    const connection = contract.connect(signer);

    const result = await contract.addTransaction(connection.address, value);

    return result.hash;
  };

  const displayRazorpay = async (amount,  org) => {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Basic hDaah8khGYGdnPlIH0Bk0PCt"
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      amount: amount * 100,
      currency: "INR",
    });

    var requestOptions = {
      method: "POST",
      mode: "no-cors",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.razorpay.com/v1/orders", requestOptions)
      .then(async (result) => {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          alert("you are offline");
          return;
        }

        const options = {
          key: "rzp_test_Vx5bKnJJCz2Jvb",
          amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "",
          description: "Test Transaction",
          handler: function (res) {
            addToChain(amount)
              .then((hash) => {
                console.log(hash);
                setTransactionHash(hash);
                addDoc(collection(firestore, "payments"), {
                  amount,
                  hash,
                  fromUser: {
                    name: auth.currentUser.displayName,
                    uid: auth.currentUser.uid,
                  },
                  toOrg: orgs.find((value) => value.id === org),
                  ...res,
                })
                  .then(() => console.log("Document was saved"))
                  .catch((e) => alert(`Error occured : ${JSON.stringify(e)}`));
              })
              .catch((err) => console.error(err));

            setPaySuccess(true);
            setPaymentDetails({
              ...res,
              amount,
            });
          },
          // "order_id": "order_KTL3lGufa5nvgB", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          order_id: result.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
      })
      .catch((error) => console.log("error", error));
    //     return;
  };

  return (
    <div className="container mx-auto">
      <Head>
        <title>Make a Donation</title>
        <meta name="description" content="Donate to a cause you care about" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-5xl font-bold text-center mt-14">Make a Donation</h1>

      <p className="mt-4 mb-10 text-lg text-center">
        Your donation can make a difference in someone's life today.
      </p>

      {paySuccess ? (
        <SuccessPage
          payment_id={paymentDetails.razorpay_payment_id}
          amount={paymentDetails.amount}
          transactionHash={transactionHash}
        />
      ) : (
        <div className="container mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
          <div className="form-control">
            <label htmlFor="charity" className="label">
              Select a NGO
            </label>
            <select
              className="select select-bordered"
              id="charity"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              required
            >
              <option value="Select">-- Please Select --</option>
              {orgs.map((e) => (
                <option value={e.id}>
                  {e.username} - {e.ngoId}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="amount" className="label">
              Donation Amount
            </label>
            <input
              className="input input-bordered"
              placeholder="Enter donation amount"
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />
          </div>

          <div className="flex flex-col items-center">
            <button
              className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-md btn btn-primary md:w-64 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => displayRazorpay(amount, org)}
            >
              Donate Now
            </button>
            <div className="justify-center mt-6 text-sm font-medium text-gray-500 justify"></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessPage({ payment_id, amount, transactionHash }) {
  return (
    <div className="max-w-xl mx-auto overflow-hidden shadow-lg rounded-2xl">
      <div className="px-6 py-8 text-white bg-success">
        <h2 className="text-4xl font-bold text-center">Payment Successful</h2>
      </div>
      <div className="p-8">
        <div className="grid divide-y">
          <div className="flex items-center justify-between p-4">
            <p>Payment ID</p>
            <p className="text-lg font-bold">{payment_id}</p>
          </div>
          <div className="flex items-center justify-between p-4">
            <p>Amount</p>
            <p className="text-lg font-bold text-success">₹{amount}</p>
          </div>
          <div className="flex items-center justify-between p-4">
            <p>Transaction Hash</p>
            <input
              className="input input-bordered"
              contentEditable={false}
              value={transactionHash}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
