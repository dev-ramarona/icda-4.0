"use client";

import AssetForm from "@/assets/form";
import { accountsType } from "../../../models/model";
import { actionState, ActionAccount } from "../../../handlers/action";
import { AssetInput, AssetSelect } from "@/assets/input";
import {
  ActivitySquare,
  AtSign,
  LockKeyholeIcon,
  Mail,
  ShieldUser,
  User2,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import AssetButton from "@/assets/button";

export default function FormAccounts({
  actionSet,
  actionData,
  keyRoles,
}: {
  actionSet: React.Dispatch<React.SetStateAction<accountsType | undefined>>;
  actionData?: accountsType;
  keyRoles: string[];
}) {
  // Action
  const ActionInit: actionState = {};
  const [actionState, actionForm, actionPending] = useActionState(
    ActionAccount,
    ActionInit,
  );
  const actionClose = () => {
    actionSet(undefined);
    responseSet(undefined);
  };

  // Response action
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [response, responseSet] = useState<actionState>();
  useEffect(() => {
    actionState.error && responseSet({ error: actionState.error });
    if (actionState.success) {
      responseSet({ success: actionState.success });
      if (timeRef.current) clearTimeout(timeRef.current);
      timeRef.current = setTimeout(async () => {
        responseSet(undefined);
        actionClose();
      }, 1000);
    }
  }, [actionState]);

  // Label action
  const [label, labelSet] = useState("");
  const [status, statusSet] = useState<string>("passive");
  useEffect(() => {
    if (actionData?.createn) {
      labelSet("Create Account");
    } else labelSet("Update Account");
    if (actionData?.status) statusSet(actionData.status);
  });

  return (
    <AssetForm
      className="grid-cols-1 md:grid-cols-2"
      actionData={actionData}
      actionSet={actionSet}
      responseSet={responseSet}
      actionForm={actionForm}
    >
      <div className="col-span-1 text-xl font-semibold md:col-span-2">
        {label}
      </div>
      <AssetInput
        className="hidden"
        typeData="hidden"
        queryKey="action"
        queryVal={actionData?.createn ? "create" : "update"}
      />
      <div>
        <div className="p-1 text-sm font-medium">Username</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="username"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.username}
          readOnly={!actionData?.createn}
        >
          <AtSign className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Password</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="password"
          titleInput="e.g Praboro Subianto"
          typeData="password"
          queryVal={actionData?.password}
        >
          <LockKeyholeIcon className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Staff Name</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="namefull"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.namefull}
        >
          <User2 className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Staff Email</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="email"
          titleInput="e.g Praboro Subianto"
          typeData="email"
          queryVal={actionData?.email}
        >
          <Mail className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div className="col-span-1 md:col-span-2">
        <div className="p-1 text-sm font-medium">Roles</div>
        <AssetSelect
          className="h-7 w-full"
          titleHide={true}
          queryKey="role"
          titleInput="e.g Praboro Subianto"
          selectVal={keyRoles}
          queryVal={actionData?.role}
        >
          <ShieldUser className="w-4 text-slate-400" />
        </AssetSelect>
      </div>
      <div className="col-span-1 md:col-span-2">
        <div className="p-1 text-sm font-medium">Status</div>
        <AssetSelect
          className="h-7 w-full"
          titleHide={true}
          queryKey="status"
          titleInput="e.g Praboro Subianto"
          selectVal={["active", "passive", "inactive"]}
          queryVal={status}
        >
          <ActivitySquare className="w-4 text-slate-400" />
        </AssetSelect>
      </div>
      <div className="col-span-1 w-full py-1 text-center text-red-600 duration-300 md:col-span-2">
        {response?.error}
      </div>
      <div className="col-span-1 w-full py-1 text-center font-semibold text-green-600 duration-300 md:col-span-2">
        {response?.success}
      </div>
      <div className="col-span-1 md:col-span-2">
        <div className="flex h-10 w-full items-center justify-center gap-3">
          <AssetButton
            className="lorem h-full w-40 max-w-1/3"
            active="pasive"
            color="dark"
            type="submit"
          >
            <div>{actionPending ? "Wait" : label}</div>
          </AssetButton>
          <AssetButton
            className="lorem h-full w-40 max-w-1/3"
            active="pasive"
            color="danger"
            type="button"
            action={actionClose}
          >
            <div>Cancel</div>
          </AssetButton>
        </div>
      </div>
    </AssetForm>
  );
}
