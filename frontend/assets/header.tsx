"use client";

import { useEffect, useState } from "react";

export default function AssetHeader({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  const [isTop, setIsTop] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsTop(scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="flex h-32 w-full items-end justify-center pb-10">
      <div className="text-center">
        <div className="text-3xl font-bold">{title}</div>
        <div className="text-xs leading-1 font-semibold">{desc}</div>
      </div>
      <div
        className={`fixed top-0 z-20 flex w-36 items-center justify-center rounded-b-xl bg-cyan-800/30 shadow-md shadow-slate-200 backdrop-blur-md ${
          isTop > 80 ? "h-7 opacity-100" : "h-0 opacity-0"
        } duration-300 ease-in-out`}
      >
        {/* <SvgTopCloud /> */}
        <div className="text-sm font-bold">{title}</div>
      </div>
    </div>
  );
}
