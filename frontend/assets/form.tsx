"use client";
import { actionState } from "@/app/private/user/handlers/action";
import { AnimatePresence, motion } from "motion/react";
import { SetStateAction, useEffect, useRef } from "react";

export default function AssetForm({
  className,
  children,
  actionData,
  actionSet,
  responseSet,
  actionForm,
}: {
  className?: string;
  children: React.ReactNode;
  actionData?: any;
  actionSet: React.Dispatch<React.SetStateAction<any | undefined>>;
  responseSet: React.Dispatch<SetStateAction<actionState | undefined>>;
  actionForm: (payload: FormData) => void;
}) {
  // Response reset
  const responseReset = () => responseSet && responseSet(undefined);

  // Close escape and click
  const divref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        actionSet(undefined);
        responseSet(undefined);
      }
    };
    const closeClicko = (event: MouseEvent) => {
      if (divref.current && !divref.current.contains(event.target as Node)) {
        actionSet(undefined);
      }
    };
    window.addEventListener("keydown", closeEscape);
    document.addEventListener("mousedown", closeClicko);
    return () => {
      window.removeEventListener("keydown", closeEscape);
      document.addEventListener("mousedown", closeClicko);
    };
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 z-40 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-xs ${
        actionData ? "opacity-100" : "pointer-events-none opacity-0"
      } duration-300 ease-in-out`}
    >
      <AnimatePresence>
        <motion.form
          layout
          className={`grid h-fit w-5/6 gap-3 rounded-xl bg-slate-100 p-3 md:max-w-160 ${
            !actionData ? "translate-x-10" : ""
          } ${className ?? ""}`}
          action={actionForm}
          onChange={responseReset}
          ref={divref}
          transition={{
            layout: {
              duration: 0.3,
              ease: "easeInOut",
            },
          }}
        >
          {children}
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
