import Link from "next/link";
import Image from "next/image";
import { IconExternalLink } from "@tabler/icons-react";

export default function TreeCard({
  id,
  name,
  imageUrl,
  species,
  type,
  adoptedBy,
}) {
  return (
    <div>
      <div className="w-full overflow-hidden duration-200 bg-gray-200 rounded-md min-h-80 aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          width={200}
          height={320}
          src={imageUrl}
          alt={name}
          className="object-cover object-center w-full h-full lg:h-full lg:w-full"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between mt-4">
          <div>
            <h3 className="font-bold text-md text-base-content">
              <div>{name}</div>
            </h3>
            <p className="mt-1 text-sm text-base-content opacity-70">
              {species} &middot; {type}
            </p>
          </div>
          <div>
            <Link href={`/tree/${id}`} className="btn btn-circle btn-md">
              <IconExternalLink />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
