"use client";
import { AssetInput, AssetSelect } from "@/assets/input";
import {
  ActivitySquare,
  FileSlidersIcon,
  GitCompare,
  KeyRound,
  LayoutPanelTop,
  PlusCircleIcon,
  ShieldKeyholeIcon,
  Variable,
  XCircle,
} from "lucide-react";

import AssetButton from "@/assets/button";
import { useActionState, useEffect, useRef, useState } from "react";
import { filtersType, rolesType } from "../../../models/model";
import { AnimatePresence, motion } from "motion/react";
import AssetForm from "@/assets/form";
import { ActionRole, actionState } from "../../../handlers/action";

export default function FormRoles({
  actionSet,
  actionData,
  formatKeys,
  permitKeys,
}: {
  actionSet: React.Dispatch<React.SetStateAction<rolesType | undefined>>;
  actionData?: rolesType;
  formatKeys: string[];
  permitKeys: string[];
}) {
  // Action
  const ActionInit: actionState = {};
  const [actionState, actionForm, actionPending] = useActionState(
    ActionRole,
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
  const [status, statusSet] = useState<string>("active");
  useEffect(() => {
    if (actionData?.createn) {
      labelSet("Create Role");
    } else labelSet("Update Role");
    if (actionData?.status) statusSet(actionData.status);
  });

  // Action add more filter
  const filterBlank: filtersType = { field: "", operator: "in", value: [] };
  const [filter, filterSet] = useState<filtersType[]>([filterBlank]);
  useEffect(() => {
    if (actionData && actionData.filters.length > 0) {
      filterSet(actionData?.filters);
    } else filterSet([filterBlank]);
  }, [actionData]);
  const addFilter = () => {
    if (filter.length > 5) {
      responseSet({ error: "maximum filter" });
    } else filterSet((prev) => [...prev, filterBlank]);
  };
  const removeFilter = (idx: number) => {
    if (filter.length > 1)
      filterSet(filter.filter((_, index) => index !== idx));
  };
  return (
    <AssetForm
      className="grid-cols-1"
      actionData={actionData}
      actionSet={actionSet}
      responseSet={responseSet}
      actionForm={actionForm}
    >
      <div className="text-xl font-semibold">{label}</div>
      <AssetInput
        className="hidden"
        typeData="hidden"
        queryKey="action"
        queryVal={actionData?.createn ? "create" : "update"}
      />
      <div>
        <div className="p-1 text-sm font-medium">Role key</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="rolekey"
          titleInput="RLE_(SEGMENT)_(KEY)"
          typeData="text"
          queryVal={actionData?.rolekey}
          readOnly={!actionData?.createn}
        >
          <ShieldKeyholeIcon className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Filter</div>
        <AnimatePresence>
          {filter.map((val, idx) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              key={idx}
            >
              <div className="flex gap-3">
                <div className="w-full">
                  <div className="p-1 text-xs font-medium">Field</div>
                  <AssetInput
                    className="h-7 w-full"
                    titleHide={true}
                    queryKey="field"
                    titleInput="Name of field"
                    typeData="text"
                    queryVal={val?.field}
                  >
                    <LayoutPanelTop className="w-4 text-slate-400" />
                  </AssetInput>
                </div>
                <div className="w-fit">
                  <div className="p-1 text-xs font-medium">Operator</div>
                  <AssetSelect
                    className="h-7 w-14"
                    titleHide={true}
                    queryKey="operator"
                    titleInput="in / out"
                    selectVal={["in", "out"]}
                    queryVal={val?.operator}
                  >
                    <GitCompare className="w-4 text-slate-400" />
                  </AssetSelect>
                </div>
                <div className="w-full">
                  <div className="p-1 text-xs font-medium">Value</div>
                  <AssetInput
                    className="h-7 w-full"
                    titleHide={true}
                    queryKey="value"
                    titleInput="Name of value"
                    typeData="text"
                    queryVal={val?.value.join("|")}
                  >
                    <Variable className="w-4 text-slate-400" />
                  </AssetInput>
                </div>
                <div>
                  <div className="p-1 text-xs font-medium opacity-0">x</div>
                  <AssetButton
                    className="h-7 w-7"
                    color="danger"
                    active={filter.length == 1 ? "inactive" : "pasive"}
                    type="button"
                    action={() => removeFilter(idx)}
                  >
                    <XCircle />
                  </AssetButton>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="w-full justify-center py-3">
            <AssetButton
              className="h-6 w-full"
              color="dark"
              active="pasive"
              type="button"
              action={addFilter}
            >
              <div className="flex h-15 items-center justify-center">
                Add Filter <PlusCircleIcon className="p-1" />
              </div>
            </AssetButton>
          </div>
        </AnimatePresence>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Formats</div>
        <AssetSelect
          className="h-7 w-full"
          titleHide={true}
          queryKey="formats"
          titleInput="e.g Praboro Subianto"
          selectVal={formatKeys}
          queryVal={actionData?.formats}
          multiple={true}
        >
          <FileSlidersIcon className="w-4 text-slate-400" />
        </AssetSelect>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Permits</div>
        <AssetSelect
          className="h-7 w-full"
          titleHide={true}
          queryKey="permits"
          titleInput="e.g Praboro Subianto"
          selectVal={permitKeys}
          queryVal={actionData?.permits}
          multiple={true}
        >
          <KeyRound className="w-4 text-slate-400" />
        </AssetSelect>
      </div>
      <div className="col-span-1">
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
      <div className="w-full py-1 text-center text-red-600 duration-300">
        {response?.error}
      </div>
      <div className="w-full py-1 text-center font-semibold text-green-600 duration-300">
        {response?.success}
      </div>
      <div>
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
//       ? labelActionSet("Create Role")
//       : labelActionSet("Update Role ");
//   });

//   // Action add more filter
//   const filterBlank: filtersType = { field: "", operator: "", value: [] };
//   const [filter, filterSet] = useState<filtersType[]>([filterBlank]);
//   useEffect(() => {
//     if (Array.isArray(action?.filters)) {
//       if (action.filters.length > 0) filterSet(action?.filters);
//       else filterSet([filterBlank]);
//     }
//   }, [action]);
//   const timeFilter = useRef<NodeJS.Timeout | null>(null);
//   const addFilter = () => {
//     if (filter.length > 5) {
//       if (timeFilter.current) clearTimeout(timeFilter.current);
//       return setTimeout;
//     }
//     filterSet((prev) => [...prev, filterBlank]);
//   };

//   return (
//     <div
//       className={`fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-xs ${
//         action ? "opacity-100" : "pointer-events-none opacity-0"
//       } duration-300 ease-in-out`}
//     >
//       <div
//         className={`h-120 min-h-fit w-150 max-w-5/6 rounded-xl bg-slate-100 whitespace-nowrap ${
//           action ? "translate-x-0 -translate-y-10" : "translate-x-40 opacity-0"
//         } duration-300 ease-in-out`}
//       >
//         <div className="grid grid-cols-1 gap-x-6 gap-y-3 p-6">
//           <div className="col-span-1 text-center text-xl font-semibold">
//             {labelAction}
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Role Key</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={action?.rolekey}
//               disable={labelAction.includes("Update")}
//             >
//               <User2 className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Filter</div>
//             {filter.map((val, idx) => (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.2 }}
//                 key={idx}
//               >
//                 <div className="grid grid-cols-3 gap-1 md:gap-3">
//                   <div>
//                     <div className="p-1 text-xs font-medium">Field</div>
//                     <AssetInput
//                       className="h-7 w-full"
//                       titleHide={true}
//                       queryKey="user_search"
//                       titleInput="e.g Praboro Subianto"
//                       typeData="text"
//                       queryVal={val.field}
//                     >
//                       <FilterIcon className="w-4 text-slate-400" />
//                     </AssetInput>
//                   </div>
//                   <div>
//                     <div className="p-1 text-xs font-medium">Operator</div>
//                     <AssetSelect
//                       className="h-7 w-full"
//                       titleHide={true}
//                       titleInput="in / out"
//                       queryKey="operator"
//                       selectVal={["in", "out"]}
//                     >
//                       <ChevronDownCircleIcon className="w-4 text-slate-400" />
//                     </AssetSelect>
//                   </div>
//                   <div>
//                     <div className="p-1 text-xs font-medium">Value</div>
//                     <AssetInput
//                       className="h-7 w-full"
//                       titleHide={true}
//                       queryKey="user_search"
//                       titleInput="e.g Praboro Subianto"
//                       typeData="text"
//                       queryVal={val.value.join("-")}
//                     >
//                       <FilterIcon className="w-4 text-slate-400" />
//                     </AssetInput>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//             <div className="w-full justify-center py-3">
//               <AssetButton
//                 className="h-6 w-full"
//                 color="dark"
//                 active="pasive"
//                 action={addFilter}
//               >
//                 <div className="flex h-15 items-center justify-center">
//                   Add Filter <PlusCircleIcon className="p-1" />
//                 </div>
//               </AssetButton>
//             </div>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Formats</div>
//             <AssetSelect
//               className="h-7 w-full"
//               titleHide={true}
//               titleInput="Format header sequence"
//               multiple={true}
//               queryKey="formats"
//               queryVal={action?.formats}
//               selectVal={formatKeys}
//             >
//               <AtSign className="w-4 text-slate-400" />
//             </AssetSelect>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Permits</div>
//             <AssetSelect
//               className="h-7 w-full"
//               titleHide={true}
//               titleInput="Permition API endpoint"
//               multiple={true}
//               queryKey="permits"
//               queryVal={action?.permits}
//               selectVal={permitKeys}
//             >
//               <AtSign className="w-4 text-slate-400" />
//             </AssetSelect>
//           </div>
//           <div className="col-span-1">
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
