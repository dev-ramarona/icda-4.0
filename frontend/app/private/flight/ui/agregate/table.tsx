import AssetButton from "@/assets/button";
import {
  AssetLayoutBtext,
  AssetLayoutScrolly,
  AssetLayoutTable,
  AssetLayoutTbodym,
  AssetLayoutTbodyr,
  AssetLayoutThead,
} from "@/assets/layout";
import { FileEditIcon } from "lucide-react";

import AssetCard from "@/assets/card";
import { agregatesType } from "../../models/model";

export default function TableAgregate({
  arrayObj,
  actionSet,
}: {
  arrayObj: agregatesType[];
  actionSet: React.Dispatch<React.SetStateAction<agregatesType | undefined>>;
}) {
  return (
    <AssetLayoutScrolly className="h-120 p-3">
      {arrayObj && (
        <AssetLayoutTable>
          <AssetLayoutThead object={arrayObj[0]} stickyr={["Action"]} />
          <tbody>
            {arrayObj.map((row, key) => (
              <tr key={key}>
                {Object.entries(row || {}).map(([key, col]) => (
                  <AssetLayoutTbodym key={key}>
                    {key === "status" ? (
                      col === "inactive" ? (
                        <AssetCard fst={col} />
                      ) : col === "passive" ? (
                        <AssetCard scd={col} />
                      ) : (
                        <AssetCard trd={col as string} />
                      )
                    ) : (
                      <AssetLayoutBtext
                        className="max-w-32 md:max-w-60"
                        str={col}
                      />
                    )}
                  </AssetLayoutTbodym>
                ))}
                <AssetLayoutTbodyr>
                  <AssetButton
                    className="h-7 w-7"
                    color="danger"
                    active="pasive"
                    // action={}
                  >
                    <FileEditIcon />
                  </AssetButton>
                </AssetLayoutTbodyr>
              </tr>
            ))}
          </tbody>
        </AssetLayoutTable>
      )}
    </AssetLayoutScrolly>
  );
}
