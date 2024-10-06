import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header.jsx";
import { useSensorStore } from "@/store/sensor-data";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { IconCircle } from "@tabler/icons-react";
import { IconCircleFilled } from "@tabler/icons-react";

export default function Sensors() {
  const sensorStore = useSensorStore();
  const FetchAPI =
  function addSensor() {
    sensorStore.addSensor(Date.now());
  }

  return (
    <>
      <Header title="Plant Status(A non-volunteer based growth tracking system)" />

      <div className="container grid grid-cols-3 mx-auto mt-12 px-4 sm:px-6 lg:px-8 gap-6">
        <button
          onClick={FetchAPI}
          className="bg-primary h-[200px] flex items-center justify-center gap-2 rounded-xl hover:opacity-90 duration-150"
        >
          <IconPlus />
          <span className="text-xl">Add</span>
        </button>
        {Object.entries(sensorStore.data).map(([id, e], index) => (
          <Link href={`/sensors/${id}`} alt="link" key={id} className="border-2 border-base-content/50 p-4 rounded-xl hover:border-primary duration-150">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h6 className="font-thin">Plant </h6>
                <h3 className="font-bold text-xl text-base-content">
                  <div>{id}</div>
                </h3>
              </div>
              <div className="flex gap-2">
                <IconCircleFilled className="text-primary animate-pulse" />
                <span>Active</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
