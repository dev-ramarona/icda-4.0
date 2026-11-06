import { AssetInput, AssetSelect } from "@/assets/input";
import {
  ActivitySquare,
  GitBranchPlus,
  KeyRound,
  MonitorSmartphone,
  Route,
  User2,
} from "lucide-react";
import { permitsType } from "../../../models/model";
import AssetButton from "@/assets/button";
import { useActionState, useEffect, useRef, useState } from "react";
import AssetForm from "@/assets/form";
import { ActionPermit, actionState } from "../../../handlers/action";

export default function FormPermits({
  actionSet,
  actionData,
}: {
  actionSet: React.Dispatch<React.SetStateAction<permitsType | undefined>>;
  actionData?: permitsType;
}) {
  // Action
  const ActionInit: actionState = {};
  const [actionState, actionForm, actionPending] = useActionState(
    ActionPermit,
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
      labelSet("Create Permit");
    } else labelSet("Update Permit");
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
        <div className="p-1 text-sm font-medium">Permit key</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="permitkey"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.permitkey}
          readOnly={!actionData?.createn}
        >
          <KeyRound className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Endpoint</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="endpoint"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.endpoint}
        >
          <Route className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Method</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="method"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.method}
        >
          <GitBranchPlus className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Screen</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="screen"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.screen}
        >
          <MonitorSmartphone className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
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

//   // Close escape
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) =>
//       event.key === "Escape" && actionSet(null);
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // Monitor action edit
//   const [labelAction, labelActionSet] = useState("");
//   useEffect(() => {
//     action?.isedit
//       ? labelActionSet("Create Permit")
//       : labelActionSet("Update Permit ");
//   });
//   return (
//     <div
//       className={`fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-xs ${
//         action ? "opacity-100" : "pointer-events-none opacity-0"
//       } duration-300 ease-in-out`}
//     >
//       <div
//         className={`h-96 min-h-fit w-150 max-w-5/6 rounded-xl bg-slate-100 whitespace-nowrap ${
//           action ? "translate-x-0 -translate-y-10" : "translate-x-40 opacity-0"
//         } duration-300 ease-in-out`}
//       >
//         <div className="grid grid-cols-1 gap-x-6 gap-y-3 p-6">
//           <div className="text-center text-xl font-semibold">{labelAction}</div>
//           <div>
//             <div className="p-1 text-sm font-medium">Permit Key</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={action?.permitkey}
//               disable={labelAction.includes("Update")}
//             >
//               <User2 className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Endpoint</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={action?.endpoint}
//             >
//               <Mail className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Method</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={action?.method}
//             >
//               <AtSign className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Screen</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={action?.screen}
//             >
//               <LockKeyholeIcon className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div className="col-span-1 py-6">
//             <div className="flex h-10 w-full items-center justify-center gap-3">
//               <AssetButton
//                 className="lorem h-full w-40 max-w-1/3"
//                 active="pasive"
//                 color="dark"
//               >
//                 <div>{labelAction ? "Create user" : "Update user"}</div>
//               </AssetButton>
//               <AssetButton
//                 className="lorem h-full w-40 max-w-1/3"
//                 active="pasive"
//                 color="warning"
//                 action={() => actionSet(null)}
//               >
//                 <div>Cancel</div>
//               </AssetButton>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
