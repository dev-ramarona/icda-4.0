import React from "react";

export default function AssetCard({
  fst,
  scd,
  trd,
  children,
}: {
  fst?: string;
  scd?: string;
  trd?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="cursor-pointer overflow-hidden rounded-xl bg-white p-2 ring-2 ring-slate-200">
      <div className="flex flex-col justify-center text-center text-wrap">
        <span className="font-semibold text-red-600">{fst}</span>
        <span className="font-semibold text-blue-600">{scd}</span>
        <span>{trd}</span>
        {children}
      </div>
    </div>
  );
}
