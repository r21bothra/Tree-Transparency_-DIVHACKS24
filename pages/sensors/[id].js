import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IconRefresh, IconAlertCircle } from "@tabler/icons-react";
import { useSensorStore } from "@/store/sensor-data";
import Header from "@/components/Header.jsx";

export default function Sensor() {
  const router = useRouter();
  const id = router.query.id ?? "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensorStore = useSensorStore();

  async function fetchData() {
    try {
      const response = await fetch(
        "https://api.thingspeak.com/channels/2314600/feeds.json?results"
      );
      const jsonData = await response.json();
      setData(jsonData.feeds);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchData();
  }, []);




  return (
    <>
      <Header title={`Plant ${id}`} />

      <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p>Loading...</p>
        ) : !data || data.length === 0 ? (
          <div className="flex items-center gap-2 justify-center min-h-[200px] rounded bg-error text-error-content">
            <IconAlertCircle />
            <h2 className="text-xl flex items-center">Sensor Not Found</h2>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4 gap-4">
              <button
                onClick={fetchData}
                className="flex bg-secondary px-4 py-2 rounded"
              >
                <IconRefresh />
                <span>Refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full table-compact">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Height</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, index) => (
                    <tr key={entry.entry_id}>
                      <td>{entry.entry_id}</td>
                      <td>{`${entry.field1} cm`}</td>

                      <td>{index == 0 ? "" : parseFloat(entry.field1) - parseFloat(data[index - 1].field1) > 10 ? "Needs Care" : "Growing"
                      }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
