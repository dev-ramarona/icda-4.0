"use client";

import { AssetLayoutScrolly } from "@/assets/layout";
import { AssetLoading } from "@/assets/loading";
import { HandleQueryReplace } from "@/lib/query";
import { useState } from "react";
import { AssetInput } from "@/assets/input";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  ContactRound,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Route,
  SearchCode,
  SearchX,
  TicketsPlane,
} from "lucide-react";
import AssetButton from "@/assets/button";

export default function SearchDetail({ searchVal }: { searchVal?: string }) {
  const [queryReplace, wait] = HandleQueryReplace();
  const [tempval, tempvalSet] = useState("");
  const funcSearch = (search: string) =>
    queryReplace({ search: search, page: "" });
  const functReset = () => queryReplace({ search: "", page: "" });
  return (
    <AssetLayoutScrolly className="h-fit p-1">
      <AssetLoading show={wait} size="sm" />
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6 px-1 pt-6 pb-1">
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="date of travel Start"
            typeData="date"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <CalendarArrowDown className="text-slate-400" />
          </AssetInput>
          <div className="mx-1 h-6 w-1 rotate-12 rounded-full bg-slate-400" />
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="date of travel End"
            typeData="date"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <CalendarArrowUp className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="Airline"
            typeData="text"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <Plane className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="Flight number"
            typeData="text"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <PlaneLanding className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="Departure"
            typeData="text"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <PlaneTakeoff className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="Route"
            typeData="text"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <Route className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="PNR Code"
            typeData="text"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <ContactRound className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex items-center gap-1">
          <AssetInput
            className="h-8 w-36 md:w-40"
            queryKey="user_search"
            titleInput="Ticket Number"
            typeData="text"
            queryVal={searchVal}
            action={(e) => tempvalSet(e.currentTarget.value)}
            actionEnter={(e) => funcSearch(e.currentTarget.value)}
          >
            <TicketsPlane className="text-slate-400" />
          </AssetInput>
        </div>
        <div className="flex w-full items-center justify-center gap-1 md:w-fit">
          <AssetButton
            className="h-8 w-10"
            color="dark"
            active="pasive"
            type="submit"
            action={() => funcSearch(tempval)}
          >
            <SearchCode className="h-5 text-slate-100" strokeWidth="2.5" />
          </AssetButton>
          <AssetButton
            className="h-8 w-10"
            color="danger"
            active="pasive"
            type="button"
            action={() => functReset()}
          >
            <SearchX className="h-5 text-white" strokeWidth="2.5" />
          </AssetButton>
        </div>
        <div className="flex items-center gap-1">
          <AssetButton
            className="h-8 w-20"
            color="dark"
            active="pasive"
            type="button"
            action={() => functReset()}
          >
            Download
          </AssetButton>
        </div>
      </div>
    </AssetLayoutScrolly>
  );
}
