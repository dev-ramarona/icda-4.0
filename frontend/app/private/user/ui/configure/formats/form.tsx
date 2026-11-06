"use client";
import { AssetInput, AssetSelect } from "@/assets/input";
import AssetButton from "@/assets/button";
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { formatsType } from "../../../models/model";
import { ActionFormat, actionState } from "../../../handlers/action";
import AssetForm from "@/assets/form";
import {
  ActivitySquare,
  AtSign,
  ChevronDownCircleIcon,
  Columns3,
  FileKey,
  Heading,
  PlusCircleIcon,
  XCircleIcon,
} from "lucide-react";
import AssetCard from "@/assets/card";
import { Reorder } from "motion/react";

export default function FormFormats({
  actionSet,
  actionData,
}: {
  actionSet: React.Dispatch<React.SetStateAction<formatsType | undefined>>;
  actionData?: formatsType;
}) {
  // Action
  const ActionInit: actionState = {};
  const [actionState, actionForm, actionPending] = useActionState(
    ActionFormat,
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
      labelSet("Create Format");
    } else labelSet("Update Format");
    if (actionData?.status) statusSet(actionData.status);
  });

  // Monitor action edit
  const [field, fieldSet] = useState("");
  const [fields, fieldsSet] = useState([""]);
  useEffect(() => {
    if (actionData) {
      fieldsSet(actionData.fields);
    }
  }, [actionData]);
  const addField = (e: ChangeEvent<HTMLInputElement, Element>) => {
    const val = e.currentTarget.value;
    if (val != "") fieldSet(val.replaceAll(" ", "_"));
  };
  const addFields = () => {
    fieldsSet((prev) => {
      if (field.length > 0 && !prev.includes(field)) return [...prev, field];
      return prev;
    });
    fieldSet("");
  };
  const removeField = (val: string) =>
    fieldsSet((prev) => prev.filter((item) => item !== val));

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
        <div className="p-1 text-sm font-medium">Format key</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="formatkey"
          titleInput="FMT_(SEGMENT)_(KEY)"
          typeData="text"
          queryVal={actionData?.formatkey}
          readOnly={!actionData?.createn}
        >
          <FileKey className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="p-1 text-sm font-medium">Format title</div>
        <AssetInput
          className="h-7 w-full"
          titleHide={true}
          queryKey="formatttl"
          titleInput="e.g Praboro Subianto"
          typeData="text"
          queryVal={actionData?.formatttl}
        >
          <Heading className="w-4 text-slate-400" />
        </AssetInput>
      </div>
      <div>
        <div className="flex gap-3">
          <div className="w-full">
            <div className="p-1 text-sm font-medium">Fields</div>
            <AssetInput
              className="h-7 w-full"
              titleHide={true}
              queryKey="field"
              titleInput="e.g Praboro Subianto"
              typeData="text"
              queryVal={field}
              action={addField}
              actionEnter={addFields}
            >
              <Columns3 className="w-4 text-slate-400" />
            </AssetInput>
          </div>
          <div>
            <div className="p-1 text-sm font-medium opacity-0">x</div>
            <AssetButton
              className="h-7 w-7"
              color="dark"
              active={"pasive"}
              type="button"
              action={() => addFields()}
            >
              <PlusCircleIcon />
            </AssetButton>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Reorder.Group
            axis="xy"
            values={fields}
            onReorder={fieldsSet}
            className="flex flex-wrap justify-center gap-1.5 pb-3"
          >
            {fields.map((val, idx) => (
              <Reorder.Item key={val} value={val}>
                <AssetCard>
                  <div className="flex items-center">
                    <AssetInput
                      className="hidden"
                      typeData="hidden"
                      queryKey="fields"
                      queryVal={val}
                    />
                    <span className="pr-1">{idx + 1}.</span>
                    <span>{val}</span>
                    <XCircleIcon
                      className="pl-1 text-slate-500 duration-300 hover:scale-110"
                      onClick={() => removeField(val)}
                    />
                  </div>
                </AssetCard>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
      <div className="">
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
      <div className="">
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
//   const [field, fieldSet] = useState("");
//   const [fields, fieldsSet] = useState([""]);
//   const [labelAction, labelActionSet] = useState("");
//   useEffect(() => {
//     if (actionData) {
//       labelActionSet("Create Format");
//       fieldsSet(actionData.fields);
//     } else labelActionSet("Update Format ");
//   }, [actionData]);
//   const addField = (e: ChangeEvent<HTMLInputElement, Element>) => {
//     const val = e.currentTarget.value;
//     if (val != "") fieldSet(val.replaceAll(" ", ""));
//   };
//   const addFields = () => {
//     fieldsSet((prev) => {
//       if (prev.includes(field)) return prev;
//       return [...prev, field];
//     });
//     fieldSet("");
//   };
//   const removeField = (val: string) =>
//     fieldsSet((prev) => prev.filter((item) => item !== val));
//   return (
//     <div
//       className={`fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-xs ${
//         actionData ? "opacity-100" : "pointer-events-none opacity-0"
//       } duration-300 ease-in-out`}
//     >
//       <div
//         className={`h-120 min-h-fit w-150 max-w-5/6 rounded-xl bg-slate-100 whitespace-nowrap ${
//           actionData
//             ? "translate-x-0 -translate-y-10"
//             : "translate-x-40 opacity-0"
//         } duration-300 ease-in-out`}
//       >
//         <div className="grid grid-cols-1 gap-x-6 gap-y-3 p-6">
//           <div className="text-center text-xl font-semibold">
//             {labelAction}
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Format Key</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={actionData?.formatkey}
//               readOnly={!actionData?.createn}
//             >
//               <KeyRoundIcon className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Title</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={actionData?.formatttl}
//             >
//               <LetterText className="w-4 text-slate-400" />
//             </AssetInput>
//           </div>
//           <div>
//             <div className="p-1 text-sm font-medium">Fields</div>
//             <AssetInput
//               className="h-7 w-full"
//               titleHide={true}
//               queryKey="user_search"
//               titleInput="e.g Praboro Subianto"
//               typeData="text"
//               queryVal={field}
//               action={addField}
//               actionEnter={addFields}
//             >
//               <Heading1 className="w-4 text-slate-400" />
//             </AssetInput>
//             <div className="w-full justify-center py-3">
//               <AssetButton
//                 className="h-6 w-full"
//                 color="dark"
//                 active="pasive"
//                 action={addFields}
//               >
//                 <div className="flex h-15 items-center justify-center">
//                   Add Fields <PlusCircleIcon className="p-1" />
//                 </div>
//               </AssetButton>
//             </div>
//             <Reorder.Group
//               axis="xy"
//               values={fields}
//               onReorder={fieldsSet}
//               className="flex flex-wrap justify-center gap-1.5 pb-3"
//             >
//               {fields.map((val, idx) => (
//                 <Reorder.Item key={val} value={val}>
//                   <AssetCard>
//                     <div className="flex items-center">
//                       <span className="pr-1">{idx}.</span>
//                       <span>{val}</span>
//                       <XCircleIcon
//                         className="pl-1 text-slate-500 duration-300 hover:scale-110"
//                         onClick={() => removeField(val)}
//                       />
//                     </div>
//                   </AssetCard>
//                 </Reorder.Item>
//               ))}
//             </Reorder.Group>
//           </div>
//           <div className=">
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
//     // <div className="absolute inset-3 z-20 flex items-center justify-center">
//     //   <div className="fixed top-0 h-screen w-screen bg-slate-900/20"></div>
//     //   <div className="h-full w-1/2 max-w-full min-w-80 rounded-lg bg-slate-100 p-3 shadow-lg ring ring-white backdrop-blur-sm">
//     //     <div className="pb-3 text-base font-semibold">Create new user</div>
//     //     <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
//     //       <div>
//     //         <div className="text-sm font-medium">Staff Name</div>
//     //         <div>
//     //           <AssetInput
//     //             className="h-7 w-full"
//     //             titleHide={true}
//     //             queryKey="user_search"
//     //             titleInput="e.g Praboro Subianto"
//     //             typeData="text"
//     //           >
//     //             <User2 className="w-4 text-slate-400" />
//     //           </AssetInput>
//     //         </div>
//     //       </div>
//     //       <div>
//     //         <div className="text-sm font-medium">Staff Email</div>
//     //         <div>
//     //           <AssetInput
//     //             className="h-7 w-full"
//     //             titleHide={true}
//     //             queryKey="user_search"
//     //             titleInput="here@youremail.co.id"
//     //             typeData="email"
//     //           >
//     //             <Mail className="w-4 text-slate-400" />
//     //           </AssetInput>
//     //         </div>
//     //       </div>
//     //       <div>
//     //         <div className="text-sm font-medium">Username</div>
//     //         <div>
//     //           <AssetInput
//     //             className="h-7 w-full"
//     //             titleHide={true}
//     //             queryKey="user_search"
//     //             titleInput="Username"
//     //             typeData="text"
//     //           >
//     //             <AtSign className="w-4 text-slate-400" />
//     //           </AssetInput>
//     //         </div>
//     //       </div>
//     //       <div>
//     //         <div className="text-sm font-medium">Password</div>
//     //         <div>
//     //           <AssetInput
//     //             className="h-7 w-full"
//     //             titleHide={true}
//     //             queryKey="user_search"
//     //             titleInput="Password"
//     //             typeData="password"
//     //           >
//     //             <LockKeyholeIcon className="w-4 text-slate-400" />
//     //           </AssetInput>
//     //         </div>
//     //       </div>
//     //       <div className=">
//     //         <AssetButton className="h-7 w-1/2" color="dark" active="pasive">
//     //           Create or Update user
//     //         </AssetButton>
//     //       </div>
//     //       <div className=">
//     //         <AssetButton className="h-7 w-1/2" color="warning" active="pasive">
//     //           Cancel
//     //         </AssetButton>
//     //       </div>
//     //       {/* <div>
//     //         <div className="text-sm font-medium">test</div>
//     //         <div>
//     //           <AssetSelect
//     //             className="h-7 w-full"
//     //             titleInput={listPermits[2].permitkey}
//     //             selectVal={listPermits[2].endpoint}
//     //           />
//     //         </div>
//     //       </div> */}
//     //       {/* <div className="">
//     //         <div className="py-1 text-sm font-medium">Select permits</div>
//     //         <div className="grid grid-cols-2 place-items-center justify-center gap-3 md:grid-cols-4">
//     //           {listPermits.map((val, idx) => {
//     //             const Icon = AssetIconMenu[val.permitkey] ?? LayoutGrid;
//     //             return (
//     //               <AssetSelect
//     //                 className="h-16 w-full text-slate-500"
//     //                 selectVal={val.permitkey}
//     //                 key={idx}
//     //               >
//     //                 <div className="font-semibol flex w-full flex-col items-center justify-center py-3 text-center">
//     //                   <Icon />
//     //                   <div className="pt-1.5 font-medium">
//     //                     {val.page.toUpperCase()}
//     //                   </div>
//     //                 </div>
//     //               </AssetSelect>
//     //             );
//     //           })}
//     //         </div>
//     //       </div> */}
//     //     </div>
//     //   </div>
//     // </div>
//   );
// }
