"use client";

import AssetButton from "@/assets/button";
import { Home, Mail, MessageCircleMore } from "lucide-react";
import { useRef, useState } from "react";

export default function ExploreUs() {
  const [click, clickSet] = useState<boolean[]>([false, false, false]);
  const email = "rama.rona@lionair.com;\nstephen@lionair.com;";
  const address = "Lion air tower Lt.3 \n Internal Control \n Data analyst dev";
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickToCopy = async (idx: number) => {
    if (idx < 2) {
      clickSet((prev) => {
        const newClick = [...prev];
        newClick[idx] = true;
        return newClick;
      });
      await navigator.clipboard.writeText(email);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        clickSet((prev) => Array(prev.length).fill(false));
      }, 1000);
    } else window.open("https://wa.me/+6281289659667", "_blank");
  };
  return (
    <div className="flex w-5/6 gap-3">
      <div
        className="group relative flex h-7 w-1/3 items-center justify-center"
        onClick={() => clickToCopy(0)}
      >
        <AssetButton
          className="z-10 h-full w-full"
          active="pasive"
          color="dark"
        >
          <Mail className="p-1" />
        </AssetButton>
        <div
          className={`absolute h-full font-semibold ${click[0] ? "z-10 translate-y-full opacity-100" : "opacity-0"} duration-300`}
        >
          Copied!
        </div>
      </div>
      <div
        className="group relative flex h-7 w-1/3 items-center justify-center"
        onClick={() => clickToCopy(1)}
      >
        <AssetButton
          active="pasive"
          className="z-10 h-full w-full"
          color="dark"
        >
          <Home className="p-1" />
        </AssetButton>
        <div
          className={`absolute h-full font-semibold ${click[1] ? "z-10 translate-y-full opacity-100" : "opacity-0"} duration-300`}
        >
          Copied!
        </div>
      </div>
      <div
        className="group relative flex h-7 w-1/3 items-center justify-center"
        onClick={() => clickToCopy(2)}
      >
        <AssetButton
          active="pasive"
          className="z-10 h-full w-full"
          color="dark"
        >
          <MessageCircleMore className="p-1" />
        </AssetButton>
        <div
          className={`absolute h-full font-semibold ${click[2] ? "z-10 translate-y-full opacity-100" : "opacity-0"} duration-300`}
        >
          Copied!
        </div>
      </div>
    </div>
  );
}
