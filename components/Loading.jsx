import { IconLoader2 } from "@tabler/icons-react";
import Image from 'next/image'
import TreeLoading from "../assets/TreeLoading.gif"

export default function Loading() {
  // return <div className="grid h-full place-items-center">
  //   <Image unoptimized={true} src={TreeLoading} alt="Loading Image" />
  // </div>

  return (
    <div className="grid h-full place-items-center mt-16">
      <IconLoader2 size={100} className="animate-spin" />
    </div>
  );
}
