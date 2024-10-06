import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/firebase.js";
import Header from "@/components/Header.jsx";
import { IconCopy } from "@tabler/icons-react";
import { useUserStore } from "@/store/user.js";
import Head from "next/head.js";

export default function Transactions() {
  const [isFetching, setFetching] = useState(true);
  const [payments, setPayments] = useState([]);
  const {userStore} = useUserStore();

  useEffect(() => {
    fetchPayments();
  }, []);

  function fetchPayments() {
    setFetching(true);
    let data = [];

    getDocs(collection(firestore, "payments")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setFetching(false);
      setPayments(data);
    });
  }

  return (
    <>
      <Head>
        <title>Donations</title>
      </Head>
      <Header title="Donations" />

      <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {isFetching ? (
          <div>Fetching</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full table-compact">
              <thead>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>From</th>
                <th>To</th>
                <th>Hash</th>
              </thead>
              <tbody>
                {payments.filter(e => userStore.type === 'NGOs' ? e.toOrg.id === userStore.email : true).map((payment) => (
                  <tr key={payment.razorpay_payment_id}>
                    <th>{payment.razorpay_payment_id}</th>
                    <td>{payment.amount}</td>
                    <td>{payment.fromUser.name}</td>
                    <td>{payment.toOrg?.username ?? ""}</td>
                    <td className="input-group">
                      <input
                        className="input input-bordered"
                        value={payment.hash}
                      />
                      <button className="btn">
                        <IconCopy />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Total Donations</th>
                  <td>{payments.filter(e => userStore.type === 'NGOs' ? e.toOrg.id === userStore.email : true).reduce((partialSum, a) => partialSum + parseInt(a.amount), 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
