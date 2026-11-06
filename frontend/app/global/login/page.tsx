"use client";

import { AssetInput } from "@/assets/input";
import ExploreUs from "./ui/exploreus";
import { useActionState, useEffect, useState } from "react";
import { HandlerLogin, LoginState } from "./handlers/login";
import AssetButton from "@/assets/button";
import { KeyRound, UserSearch } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const initialState: LoginState = {};
  const [response, responseSet] = useState("");
  const [state, formAction, pending] = useActionState(
    HandlerLogin,
    initialState,
  );

  // Monitor
  useEffect(() => {
    state.error && responseSet(state.error);
  }, [state]);
  const onChange = () => responseSet("");
  return (
    <section className="relative flex h-full min-h-screen w-full items-center justify-center md:gap-3">
      <AssetButton
        className="h-0 w-0 opacity-0 duration-300 md:h-96 md:w-96 md:opacity-100"
        active="pasive"
        disabled={pending}
        color="dark"
      >
        <div className="p-10">
          <Image
            className="invert select-none"
            src="/lionairblack.png"
            width={1000}
            height={1000}
            alt=""
          />
        </div>
      </AssetButton>
      <div className="flex h-96 w-96 max-w-5/6 flex-col items-center justify-center rounded-xl bg-slate-100 shadow-md">
        <div className="py-3 text-center">
          <div className="py-1 text-3xl">
            <span>Login </span>
            <span className="font-bold">ICDA</span>
          </div>
          <div className="px-6 text-center text-xs font-medium text-slate-600">
            Centralized & reliable data for better analysis, reporting, and
            informed decision-making.
          </div>
        </div>
        <form
          action={formAction}
          className="flex w-full flex-col items-center justify-center px-9 py-3"
        >
          <AssetInput
            queryKey="username"
            titleInput="Username"
            typeData="text"
            action={onChange}
          >
            <div className="text-slate-400/70">
              <UserSearch />
            </div>
          </AssetInput>
          <AssetInput
            queryKey="password"
            titleInput="Password"
            typeData="password"
            action={onChange}
          >
            <div className="text-slate-400/70">
              <KeyRound />
            </div>
          </AssetInput>
          <div className="py-1 text-red-600 duration-300">{response}</div>
          <AssetButton
            className="h-10 w-full px-1.5"
            active="pasive"
            disabled={pending}
            color="dark"
          >
            {pending ? "Loading..." : "Explore ICDA"}
          </AssetButton>
          <div className="py-1.5">Or explore us</div>
        </form>
        <ExploreUs />
      </div>
    </section>
  );
}
