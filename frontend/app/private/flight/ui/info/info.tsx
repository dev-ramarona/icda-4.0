import AssetLayoutGrid, { AssetLayoutFix } from "@/assets/layout";
import { TableInfoLog } from "./table";
import { agregatesType } from "../../models/model";

export default function Info({ arrayObj }: { arrayObj: agregatesType[] }) {
  return (
    <AssetLayoutGrid label="Information">
      <div className="grid w-full grid-cols-5 gap-3">
        <div className="h-160 xl:h-100">
          <AssetLayoutFix className="h-full w-full">
            <div className="flex h-full flex-col">
              <div>
                <div className="text-lg font-semibold">Log activty</div>
                <div>action data</div>
              </div>
              {/* <TableInfoLog arrayObj={arrayObj} /> */}
            </div>
          </AssetLayoutFix>
        </div>
        <div className="col-span-4 h-160 xl:h-100">
          <AssetLayoutFix className="h-full w-full">xx</AssetLayoutFix>
        </div>
      </div>
    </AssetLayoutGrid>
  );
}
