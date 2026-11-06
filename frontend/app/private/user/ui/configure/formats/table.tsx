import AssetButton from "@/assets/button";
import {
  AssetLayoutBtext,
  AssetLayoutScrolly,
  AssetLayoutTable,
  AssetLayoutTbodym,
  AssetLayoutTbodyr,
  AssetLayoutThead,
} from "@/assets/layout";
import { FileEditIcon, Trash2 } from "lucide-react";
import AssetCard from "@/assets/card";
import { formatsType } from "../../../models/model";

export default function TableFormats({
  arrayObj,
  actionSet,
}: {
  arrayObj: formatsType[];
  actionSet: React.Dispatch<React.SetStateAction<formatsType | undefined>>;
}) {
  return (
    <AssetLayoutScrolly className="h-120 p-3">
      <AssetLayoutTable>
        <AssetLayoutThead object={arrayObj[0]} stickyr={["Action"]} />
        <tbody>
          {arrayObj.map((row, key) => (
            <tr key={key}>
              {Object.entries(row || {}).map(([key, col]) => (
                <AssetLayoutTbodym key={key}>
                  {Array.isArray(col) ? (
                    col.map((val, idx) => (
                      <div key={idx}>
                        <AssetCard trd={val} />
                      </div>
                    ))
                  ) : (
                    <AssetLayoutBtext str={col} />
                  )}
                </AssetLayoutTbodym>
              ))}
              <AssetLayoutTbodyr>
                <AssetButton
                  className="h-7 w-7"
                  color="danger"
                  active="pasive"
                  action={() => actionSet(row)}
                >
                  <FileEditIcon />
                </AssetButton>
              </AssetLayoutTbodyr>
            </tr>
          ))}
        </tbody>
      </AssetLayoutTable>
    </AssetLayoutScrolly>
  );
}
