"use client";

import AssetLayoutGrid from "@/assets/layout";
import { agregatesType, queryFlightType } from "../../models/model";
import { useState } from "react";
import TableDetail from "./table";
import SearchDetail from "./search";

export default function Detail({
  querys,
  dataAgregates,
}: {
  querys: queryFlightType;
  dataAgregates: agregatesType[];
}) {
  const [agregateData, agregateSet] = useState<agregatesType>();
  return (
    <AssetLayoutGrid label="Detail Table">
      <SearchDetail />
      <TableDetail actionSet={agregateSet} arrayObj={dataAgregates} />
    </AssetLayoutGrid>
  );
}
