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
import { permitsType } from "../../../models/model";
import AssetCard from "@/assets/card";

export default function TablePermits({
  arrayObj,
  actionSet,
}: {
  arrayObj: permitsType[];
  actionSet: React.Dispatch<React.SetStateAction<permitsType | undefined>>;
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
                  <AssetLayoutBtext
                    className="max-w-32 md:max-w-60"
                    str={col}
                  />
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
