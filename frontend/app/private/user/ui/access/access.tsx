"use client";
import AssetLayoutGrid from "@/assets/layout";
import { infoType } from "../../models/model";
import Card from "./card";
import { useState } from "react";
import { ContainsSearch } from "../../utils/search";
import Switch from "@/assets/switch";
import AssetCard from "@/assets/card";

export default function Access({ userInfo }: { userInfo: infoType }) {
  const [valPermits, setPermits] = useState("");
  const [valFormats, setFormats] = useState("");
  const [valFilters, setFilters] = useState("");
  return (
    <AssetLayoutGrid label="Current Access Role">
      <div className="grid grid-cols-1 justify-center gap-3 lg:grid-cols-3">
        <div className="col-span-1 h-fit lg:col-span-3">
          <div className="w-full">
            <Switch params={userInfo.role} nowParams="" query="config" />
          </div>
        </div>
        <Card title="Permits" action={setPermits} value={valPermits}>
          <div className="grid grid-cols-1 gap-2 p-2">
            {userInfo.permits.map((val, idx) => {
              if (!ContainsSearch(val, valPermits)) return null;
              return (
                <AssetCard
                  fst={val.permitkey.replaceAll("_", " ")}
                  scd={val.method + " page:" + val.screen}
                  trd={val?.endpoint}
                  key={idx}
                />
              );
            })}
          </div>
        </Card>
        <Card title="Formats" action={setFormats} value={valFormats}>
          <div className="grid grid-cols-1 gap-2 p-2">
            {userInfo.formats.map((val, idx) => {
              if (!ContainsSearch(val, valFormats)) return null;
              return (
                <AssetCard
                  fst={val.formatkey.replaceAll("_", " ")}
                  scd={val.formatttl}
                  trd={val.fields?.join(" - ")}
                  key={idx}
                />
              );
            })}
          </div>
        </Card>
        <Card title="Filters" action={setFilters} value={valFilters}>
          <div className="grid grid-cols-1 gap-2 p-2">
            {userInfo.filters.map((val, idx) => {
              if (!ContainsSearch(val, valFilters)) return null;
              return (
                <AssetCard
                  fst={val.field}
                  scd={val.operator}
                  trd={val.value.join(" - ")}
                  key={idx}
                />
              );
            })}
          </div>
        </Card>
      </div>
    </AssetLayoutGrid>
  );
}
