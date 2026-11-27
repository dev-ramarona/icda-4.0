"use client";

import AssetLayoutGrid from "@/assets/layout";
import { agregatesType, detailType, queryFlightType } from "../../models/model";
import TableDetail from "./table";
import SearchDetail from "./search";

export default function Detail({
  querys,
  dataAgregates,
}: {
  querys: queryFlightType;
  dataAgregates: agregatesType[];
}) {
  return (
    <AssetLayoutGrid label="Detail Table">
      <SearchDetail />
      <TableDetail arrayObj={dataAgregates} />
    </AssetLayoutGrid>
  );
}
