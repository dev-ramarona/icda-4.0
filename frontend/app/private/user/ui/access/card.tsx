"use client";
import { AssetInput } from "@/assets/input";
import { AssetLayoutScrolly } from "@/assets/layout";
import { KeyRound, SearchCodeIcon } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export default function Card({
  children,
  title,
  action,
  value,
}: {
  children: ReactNode;
  title: string;
  action: Dispatch<SetStateAction<string>>;
  value: any;
}) {
  const change = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    action(e.target.value);
  };
  return (
    <AssetLayoutScrolly className="flex h-64 items-center justify-center p-3">
      <div className="sticky top-0 flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-2 pb-3">
        <div className="flex items-center justify-center gap-2">
          <div>
            <KeyRound className="h-10 w-10 rounded-xl bg-cyan-200 p-2 text-cyan-600 ring ring-white" />
          </div>
          <div className="text-base font-medium">{title}</div>
        </div>
        <AssetInput
          className="h-7 w-48 max-w-full"
          queryKey="Permits"
          queryVal={value}
          titleHide={true}
          titleInput="Search"
          typeData="text"
          action={change}
        >
          <SearchCodeIcon className="text-slate-400" />
        </AssetInput>
      </div>
      {children}
    </AssetLayoutScrolly>
  );
}
