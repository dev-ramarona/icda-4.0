"use client";

import AssetLayoutGrid from "@/assets/layout";
import { agregatesType, queryFlightType } from "../../models/model";
import TableAgregate from "./table";
import { useState } from "react";
import SearchAgregates from "./search";

export default function Agregate({
  querys,
  dataAgregates,
}: {
  querys: queryFlightType;
  dataAgregates: agregatesType[];
}) {
  const [agregateData, agregateSet] = useState<agregatesType>();
  return (
    <AssetLayoutGrid label="Agregate Table">
      <SearchAgregates />
      <TableAgregate actionSet={agregateSet} arrayObj={dataAgregates} />
    </AssetLayoutGrid>
  );
}
