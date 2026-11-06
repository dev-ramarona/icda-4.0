"use client";
import { HandleQueryReplace } from "@/lib/query";
import { ArrowUpDownIcon, LucideIcon } from "lucide-react";
import { AssetLayoutFix } from "./layout";
import AssetButton from "./button";
import { AssetLoading } from "./loading";
import { AssetSelect } from "./input";

export type modelSwitch = {
  link: string;
  title: string;
  icon: LucideIcon;
};
export default function Switch({
  params,
  nowParams,
  query,
}: {
  params: modelSwitch[] | string;
  nowParams?: string;
  query: string;
}) {
  // Manage query
  const array = Array.isArray(params)
    ? params.map((item) => item.link)
    : [params];
  const [queryReplace, waiting] = HandleQueryReplace();
  const clickSwitch = (e: string) =>
    queryReplace({ [query]: e, page: "", search: "" });
  return (
    <div className="relative mx-auto flex w-full max-w-fit items-center justify-center">
      <AssetLoading show={waiting} size="sm" />
      <AssetLayoutFix>
        {/* <div className="flex h-full w-96 max-w-full opacity-0 select-none"></div> */}
        <div className="w-full opacity-100 select-none md:pointer-events-none md:h-0 md:opacity-0">
          <AssetSelect
            className="h-8 w-full"
            queryKey={query}
            titleInput="Top or Bottom"
            selectVal={array}
            queryVal={nowParams}
            needQuery={true}
            // action={(e) => tempvalSet(e.currentTarget.value)}
            // actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <ArrowUpDownIcon className="text-slate-400" />
          </AssetSelect>
        </div>
        <div
          className={`pointer-events-none flex h-0 w-full flex-wrap items-center justify-center p-1 opacity-0 md:pointer-events-auto md:h-full md:opacity-100`}
        >
          {Array.isArray(params) ? (
            params.map((val, idx) => (
              <AssetButton
                color="dark"
                active={val.link == nowParams ? "active" : "inactive"}
                className="h-10 max-w-44 min-w-40 p-1"
                key={idx}
                action={() => clickSwitch(val.link)}
              >
                <div
                  className="flex h-full w-full cursor-pointer items-center justify-between gap-1.5 rounded-md font-semibold"
                  id={val.link}
                >
                  <val.icon />
                  <div className="w-full">{val.title}</div>
                </div>
              </AssetButton>
            ))
          ) : (
            <AssetButton
              color="dark"
              active={"active"}
              className="h-10 max-w-44 min-w-40 p-1"
            >
              <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-md font-semibold">
                {params}
              </div>
            </AssetButton>
          )}
        </div>
      </AssetLayoutFix>
    </div>
  );
}
