"use client";

import Switch, { modelSwitch } from "@/assets/switch";
import { KeyRound, TableProperties, UserCog, UserShield } from "lucide-react";

export default function SwitchConfigure({ config }: { config: string }) {
  const param: modelSwitch[] = [
    { title: "Accounts View", link: "accounts", icon: UserCog },
    { title: "Roles View", link: "roles", icon: UserShield },
    { title: "Formats View", link: "formats", icon: TableProperties },
    { title: "Permits View", link: "permits", icon: KeyRound },
  ];
  return (
    <div className="w-full">
      <Switch params={param} nowParams={config || "accounts"} query="config" />
    </div>
  );
}
