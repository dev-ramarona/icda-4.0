"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clearAllToken, payloadJWT } from "@/lib/session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import AssetButton from "./button";
import { AssetIconMenu } from "./icon";

export default function AssetNavbar({
  verifyToken,
}: {
  verifyToken: payloadJWT;
}) {
  const divref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const [lastPath, lastPathSet] = useState("x");
  useEffect(
    () => lastPathSet(path.split("/").filter(Boolean).pop() || ""),
    [path],
  );

  const [isopen, isopenSet] = useState(false);
  const [usopen, usopenSet] = useState(false);
  const [scroll, scrollSet] = useState(true);
  useEffect(() => {
    const scrollFnc = () => {
      if (window.scrollY == 0) {
        scrollSet(true);
      } else scrollSet(false);
    };
    const mousecFnc = (event: MouseEvent) => {
      if (divref.current && !divref.current.contains(event.target as Node)) {
        isopenSet(false);
        usopenSet(false);
      }
    };
    window.addEventListener("scroll", scrollFnc);
    document.addEventListener("mousedown", mousecFnc);
    return () => {
      window.removeEventListener("scroll", scrollFnc);
      document.removeEventListener("mousedown", mousecFnc);
    };
  }, []);
  return (
    <nav className="fixed z-50 h-dvh" ref={divref}>
      {/* Blur nav */}
      <div
        className={`pointer-events-none absolute h-full w-screen bg-slate-900 ${
          isopen ? "ml-64 opacity-0 md:opacity-30" : "ml-0 opacity-0"
        } duration-300`}
        onClick={() => isopenSet(!isopen)}
      />

      {/* Side nav */}
      <div
        className={`absolute flex h-full flex-col items-start justify-between bg-slate-100 whitespace-nowrap ring-2 ring-white backdrop-blur-sm ${
          isopen ? "h-full w-screen opacity-100 md:w-64" : "h-0 w-0 opacity-0"
        } duration-300`}
      >
        <div className="flex h-16 flex-col items-start justify-center pl-16 text-slate-600">
          <div className="text-xl leading-4 font-bold tracking-tight">
            Internal control
          </div>
          <div className="leading-3 font-medium">Data analyst Website</div>
        </div>
        <div className="flex w-full flex-col gap-3 px-3">
          <Link href={"/private/"} onClick={() => isopenSet(false)}>
            <AssetButton
              className="h-14 w-full"
              color="dark"
              active={lastPath == "private" ? "active" : "inactive"}
            >
              <div
                className={`flex items-center ${lastPath == "private" && "p-3"}`}
              >
                <LayoutGrid />
                <div className="px-1.5 text-left">
                  <div className="text-base leading-5 font-semibold">
                    Home page
                  </div>
                  <div className="text-[0.625rem] leading-3 whitespace-nowrap">
                    List all page
                  </div>
                </div>
              </div>
            </AssetButton>
          </Link>
          {verifyToken.screens.map((val, idx) => {
            const Icon = AssetIconMenu[val.screenkey] ?? LayoutGrid;
            return (
              <Link
                key={idx}
                href={"/private/" + val.screenkey}
                onClick={() => isopenSet(false)}
              >
                <AssetButton
                  className="h-14 w-full"
                  color="dark"
                  active={
                    lastPath == val.screenkey ||
                    (val.screenkey == "" && lastPath == "private")
                      ? "active"
                      : "inactive"
                  }
                >
                  <div
                    className={`flex items-center ${lastPath == val.screenkey && "p-3"}`}
                  >
                    <Icon />
                    <div className="px-1.5 text-left">
                      <div className="text-base leading-5 font-semibold">
                        {val.title}
                      </div>
                      <div className="text-[0.625rem] leading-3 whitespace-nowrap">
                        {val.detail}
                      </div>
                    </div>
                  </div>
                </AssetButton>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className="flex w-full justify-between gap-1 p-3">
          <div className="relative flex h-10 w-full items-center justify-center">
            <div
              className={`absolute top-0 h-full w-full ${usopen ? "pointer-events-none -translate-x-full opacity-0" : "opacity-100"} duration-300`}
              onClick={() => usopenSet(!usopen)}
            >
              <AssetButton className="absolute h-full w-full" color="dark">
                <span className="w-full text-center font-semibold">
                  {verifyToken.username}
                </span>
              </AssetButton>
            </div>
            <div
              className={`absolute top-0 h-full w-full ${usopen ? "opacity-100" : "pointer-events-none -translate-x-full opacity-0"} duration-300`}
              onClick={clearAllToken}
            >
              <AssetButton className="absolute h-full w-full" color="danger">
                <span className="w-full text-center font-semibold">Logout</span>
              </AssetButton>
            </div>
          </div>
          <AssetButton
            className="items-center justify-between bg-slate-200"
            color="dark"
            action={() => usopenSet(!usopen)}
          >
            <div className="bg-accent-400 flex h-full w-8 flex-col items-center justify-center gap-1">
              <div
                className={`absolute h-1 w-1 rounded-full bg-white ${usopen ? "-translate-x-2 -translate-y-2" : "-translate-y-2"} duration-300`}
              ></div>
              <div
                className={`absolute h-1 w-1 rounded-full bg-white ${usopen ? "translate-x-2 -translate-y-2" : ""} duration-300`}
              ></div>
              <div
                className={`absolute h-1 w-1 rounded-full bg-white ${usopen ? "" : ""}`}
              ></div>
              <div
                className={`absolute h-1 w-1 rounded-full bg-white ${usopen ? "-translate-x-2 translate-y-2" : ""} duration-300`}
              ></div>
              <div
                className={`absolute h-1 w-1 rounded-full bg-white ${usopen ? "translate-x-2 translate-y-2" : "translate-y-2"} duration-300`}
              ></div>
            </div>
          </AssetButton>
        </div>
      </div>

      {/* Icon nav */}
      <div
        className={`absolute flex cursor-pointer flex-col items-center justify-center gap-1.5 p-3 ${
          scroll || isopen ? "opacity-100" : "opacity-50 hover:opacity-100"
        } duration-300`}
        onClick={() => isopenSet(!isopen)}
      >
        <div
          className={`group flex h-10 w-10 items-center justify-center rounded-full bg-sky-800 p-1.5 backdrop-blur-xs ${
            isopen ? "" : "ring-slate-200"
          } duration-300`}
        >
          <Image
            className="invert select-none"
            src="/lionairblack.png"
            width={1000}
            height={1000}
            alt=""
          />
          <div
            className={`absolute h-1 w-1 rounded-full group-hover:translate-x-3.5 group-hover:translate-y-3.5 ${
              isopen
                ? "group-hover:bg- w-3 translate-x-3.5 translate-y-3.5 rotate-45 bg-sky-700 group-hover:bg-slate-100"
                : "translate-x-5 bg-slate-200 group-hover:h-1.5 group-hover:w-1.5"
            } duration-300`}
          ></div>
          <div
            className={`absolute h-1 w-1 rounded-full group-hover:-translate-x-3.5 group-hover:translate-y-3.5 ${
              isopen
                ? "group-hover:bg- w-3 -translate-x-3.5 translate-y-3.5 -rotate-45 bg-sky-700 group-hover:bg-slate-100"
                : "translate-y-5 bg-slate-200 group-hover:h-1.5 group-hover:w-1.5"
            } duration-300`}
          ></div>
          <div
            className={`absolute h-1 w-1 rounded-full group-hover:-translate-x-3.5 group-hover:-translate-y-3.5 ${
              isopen
                ? "group-hover:bg- w-3 -translate-x-3.5 -translate-y-3.5 rotate-45 bg-sky-700 group-hover:bg-slate-100"
                : "-translate-x-5 bg-slate-200 group-hover:h-1.5 group-hover:w-1.5"
            } duration-300`}
          ></div>
          <div
            className={`absolute h-1 w-1 rounded-full group-hover:translate-x-3.5 group-hover:-translate-y-3.5 ${
              isopen
                ? "group-hover:bg- w-3 translate-x-3.5 -translate-y-3.5 -rotate-45 bg-sky-700 group-hover:bg-slate-100"
                : "-translate-y-5 bg-slate-200 group-hover:h-1.5 group-hover:w-1.5"
            } duration-300`}
          ></div>
        </div>
      </div>
    </nav>
  );
}
