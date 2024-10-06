import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useZxing } from "react-zxing";

const QrStatus = {
  Loading: {
    status: "loading",
    message: "Searching for QR Code",
  },
  Error: {
    status: "error",
    message: "Invalid QR Code",
  },
  Success: {
    status: "success",
    message: "Found valid QR Code",
  },
};

const validUrls = [/^\/tree\/\w+$/];

export default function QRScanner() {
  const router = useRouter();
  const [status, setStatus] = useState(QrStatus.Loading);
  const [message, setMessage] = useState();
  const { ref } = useZxing({
    onDecodeResult(result) {
      validUrls.forEach((value) => {
        if (value.test(result.getText())) {
          setStatus(QrStatus.Success);
          router.push(result.getText());
          return;
        }
        setStatus(QrStatus.Error);
      });
    },
  });

  return (
    <>
      <Head>
        <title>QR Scanner</title>
      </Head>
      <div className="max-w-4xl px-4 pt-6 mx-auto prose">
        <h1>Scanner</h1>

        <button
          className={`btn ${status.status === QrStatus.Loading.status && "animate-pulse btn-info"} ${status.status === QrStatus.Error.status && "btn-error"} ${status.status === QrStatus.Success.status && "btn-success"}`}
        >
          {status.message}
        </button>

        <video className="artboard artboard-demo" ref={ref} />
      </div>
    </>
  );
}
