import Switch, { modelSwitch } from "@/assets/switch";
import {
  Feather,
  Plane,
  LucideLuggage,
  PlaneTakeoff,
  Rocket,
  Route,
  CircleArrowRightIcon,
} from "lucide-react";

export function SwitchInsightAirline({
  config,
  airlines,
}: {
  config: string;
  airlines: string[];
}) {
  const iconAirlines: Record<string, modelSwitch> = {
    JT: { link: "JT", title: "Lion Air", icon: Plane },
    ID: { link: "ID", title: "Batik Air", icon: PlaneTakeoff },
    IW: { link: "IW", title: "Wing Air", icon: Feather },
    IU: { link: "IU", title: "Super Air Jet", icon: Rocket },
    OD: { link: "OD", title: "Malindo Air", icon: Route },
    SL: { link: "SL", title: "Thai Lion Air", icon: LucideLuggage },
  };
  const param: modelSwitch[] = [];
  airlines.map((val) => param.push(iconAirlines[val]));
  return (
    <div className="w-full">
      <Switch
        query={"airline_insight"}
        params={param}
        nowParams={config || param[0].link}
      />
    </div>
  );
}

export function SwitchInsightRegion({
  config,
  regions,
}: {
  config: string;
  regions: string[];
}) {
  const param: modelSwitch[] = [];
  regions.map((val) =>
    param.push({ title: val, icon: CircleArrowRightIcon, link: val }),
  );
  return (
    <div className="w-full">
      <Switch
        query={"region_insight"}
        params={param}
        nowParams={config || regions[0]}
      />
    </div>
  );
}
