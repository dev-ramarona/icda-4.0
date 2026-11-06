import { AssetLayoutFix } from "@/assets/layout";
import AssetSummaries from "@/assets/summaries";
import {
  ChevronsUp,
  FileSliders,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function CardConfigure() {
  return (
    <div className="grid grid-cols-2 justify-center gap-3 md:grid-cols-4">
      <AssetLayoutFix>
        <AssetSummaries
          title="Total Account"
          amount={123}
          previous={"20-Aug-2026"}
          label="last created"
          icon={<UserRound />}
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Total Role"
          amount={23}
          previous={"20-Aug-2026"}
          label="last created"
          icon={<ShieldCheck />}
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Total Format"
          amount={43}
          previous={"20-Aug-2026"}
          label="last created"
          icon={<FileSliders />}
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Total Permit"
          amount={33}
          previous={"20-Aug-2026"}
          label="last created"
          icon={<KeyRound />}
        />
      </AssetLayoutFix>
    </div>
  );
}
