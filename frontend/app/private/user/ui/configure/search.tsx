"use client";

import AssetButton from "@/assets/button";
import { AssetInput } from "@/assets/input";
import { Filter, FilterX, SearchCodeIcon, UserPlus2Icon } from "lucide-react";
import { AssetLayoutScrolly } from "@/assets/layout";
import {
  accountsType,
  formatsType,
  permitsType,
  rolesType,
} from "../../models/model";
import { HandleQueryReplace } from "@/lib/query";
import { useEffect, useState } from "react";
import { AssetLoading } from "@/assets/loading";

export default function SearchConfigure({
  config,
  accountSet,
  roleSet,
  formatSet,
  permitSet,
  searchVal,
}: {
  config: string;
  accountSet?: React.Dispatch<React.SetStateAction<accountsType | undefined>>;
  roleSet?: React.Dispatch<React.SetStateAction<rolesType | undefined>>;
  formatSet?: React.Dispatch<React.SetStateAction<formatsType | undefined>>;
  permitSet?: React.Dispatch<React.SetStateAction<permitsType | undefined>>;
  searchVal?: string;
}) {
  const action = () => {
    switch (config) {
      case "roles":
        roleSet &&
          roleSet({
            rolekey: "",
            filters: [],
            formats: [],
            screens: [],
            permits: [],
            status: "",
            created: 0,
            updated: 0,
            createn: true,
          });
      case "formats":
        formatSet &&
          formatSet({
            formatkey: "",
            formatttl: "",
            fields: [],
            status: "",
            created: 0,
            updated: 0,
            createn: true,
          });

      case "permits":
        permitSet &&
          permitSet({
            permitkey: "",
            endpoint: "",
            method: "",
            screen: "",
            status: "",
            created: 0,
            updated: 0,
            createn: true,
          });
      default:
        accountSet &&
          accountSet({
            username: "",
            password: "",
            email: "",
            namefull: "",
            role: "",
            status: "",
            created: 0,
            updated: 0,
            createn: true,
          });
    }
  };

  const [queryReplace, wait] = HandleQueryReplace();
  const [tempval, tempvalSet] = useState("");
  const funcSearch = (search: string) =>
    queryReplace({ search: search, page: "" });
  const functReset = () => queryReplace({ search: "", page: "" });
  return (
    <AssetLayoutScrolly className="h-fit p-1">
      <AssetLoading show={wait} size="sm" />
      <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-5">
        <div className="col-span-1 p-1 md:col-span-4">
          <div className="flex gap-1">
            <AssetInput
              className="h-8 w-full"
              queryKey="user_search"
              titleInput="Search staff by name, email, or username..."
              titleHide={true}
              typeData="text"
              queryVal={searchVal}
              action={(e) => tempvalSet(e.currentTarget.value)}
              actionEnter={(e) => funcSearch(e.currentTarget.value)}
            >
              <SearchCodeIcon className="text-slate-400" />
            </AssetInput>
            <AssetButton
              className="h-8 w-10"
              color="dark"
              active="pasive"
              type="submit"
              action={() => funcSearch(tempval)}
            >
              <Filter className="h-4 text-slate-100" />
            </AssetButton>
            <AssetButton
              className="h-8 w-10"
              color="danger"
              active="pasive"
              type="button"
              action={() => functReset()}
            >
              <FilterX className="h-4 text-white" strokeWidth="3" />
            </AssetButton>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 p-1">
          <AssetButton
            className="h-8 w-full"
            color="dark"
            active="pasive"
            action={action}
          >
            <UserPlus2Icon className="h-4 text-white" strokeWidth="3" />
            Create {config}
          </AssetButton>
        </div>
      </div>
    </AssetLayoutScrolly>
  );
}
