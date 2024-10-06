import { IconTrees } from "@tabler/icons-react";

export default function Banner({ className }) {
  return (
    <div className={`${className} flex flex-col gap-4 items-center justify-center`}>
      <IconTrees size={70} className="text-emerald-500" />

      <h2 className="text-2xl font-bold">Tree Transparency</h2>
    </div>
  );
}
