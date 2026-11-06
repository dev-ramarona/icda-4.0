"use client";

// import { HandleQueryReplace } from "@/lib/query";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import AssetButton from "./button";
import { CheckCheck, ChevronDownCircleIcon, ListX } from "lucide-react";
import { LibFormatNumberToDate } from "@/lib/format";
import { HandleQueryReplace } from "@/lib/query";

export function AssetInput({
  className,
  queryKey,
  queryVal,
  rangeDate,
  titleInput,
  titleHide,
  children,
  needQuery,
  typeData,
  readOnly,
  action,
  actionEnter,
  actionInput,
}: {
  className?: string;
  queryKey: string;
  queryVal?: string;
  rangeDate?: number[];
  titleInput?: string;
  titleHide?: boolean;
  children?: React.ReactNode;
  needQuery?: boolean;
  typeData?: "password" | "text" | "number" | "email" | "hidden" | "date";
  readOnly?: boolean;
  action?: (e: ChangeEvent<HTMLInputElement, Element>) => void;
  actionEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  actionInput?: (s: string) => string;
}) {
  const [tmpval, tmpvalSet] = useState(queryVal ? queryVal : "");
  const usedid = useId();
  const refDate = useRef<HTMLInputElement>(null);
  const pickerDate = () => refDate.current?.showPicker();
  const [queryReplace, _] = HandleQueryReplace();
  const funcReplace = function (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    action && action(e);
    const key = e.target.name;
    const val = e.target.value;
    const trim = val.replace(/[^a-zA-Z0-9_|\-|@|.| |\/]/g, "");
    const final = actionInput ? actionInput(trim) : trim;
    tmpvalSet(final.includes("super") ? "SUPER" : final);
    if (needQuery) {
      queryReplace({ [key]: val });
    }
  };
  useEffect(() => {
    tmpvalSet(queryVal ? queryVal : "");
  }, [queryVal]);
  const funcActionEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (actionEnter && event.key === "Enter") {
      event.preventDefault();
      actionEnter(event);
    }
  };
  return (
    <div
      className={`relative ${className ? className : "h-13 w-full px-1.5 py-3 md:h-15"}`}
    >
      <label
        className={`relative flex h-full w-full items-center justify-start rounded-lg px-3 ${
          readOnly
            ? "text-slate-400 ring ring-slate-400 select-none"
            : "bg-white ring ring-slate-200"
        }`}
        htmlFor={usedid}
      >
        <div className="pointer-events-none">{children}</div>
        <div className="relative flex h-full w-full items-center justify-center">
          <input
            className={`w-full font-medium ${
              tmpval.length == 0 &&
              "flex text-white caret-black [&::-webkit-datetime-edit-day-field]:bg-transparent [&::-webkit-datetime-edit-month-field]:bg-transparent [&::-webkit-datetime-edit-year-field]:bg-transparent"
            } ${typeData == "date" ? "cursor-pointer" : "cursor-text"}`}
            id={usedid}
            type={typeData}
            name={queryKey}
            value={tmpval}
            onChange={(e) => funcReplace(e)}
            onKeyDown={funcActionEnter}
            onClick={pickerDate}
            readOnly={readOnly}
            min={
              rangeDate && typeData == "date"
                ? LibFormatNumberToDate(rangeDate[0])
                : ""
            }
            max={
              rangeDate && typeData == "date"
                ? LibFormatNumberToDate(rangeDate[rangeDate.length - 1])
                : ""
            }
            ref={refDate}
          />
          <div
            className={`pointer-events-none absolute left-0 flex h-full w-full items-center overflow-hidden px-1.5 text-[0.6rem] font-semibold whitespace-nowrap md:text-xs ${
              tmpval.length > 0
                ? `-translate-y-3/4 text-slate-500 ${titleHide && "opacity-0"}`
                : "text-slate-500/70"
            } duration-300 ease-in-out`}
          >
            {titleInput ? titleInput : ""}
          </div>
        </div>
      </label>
    </div>
  );
}

export function AssetSelect({
  className,
  queryKey,
  queryVal,
  selectVal,
  multiple,
  titleInput,
  titleHide,
  children,
  readOnly,
  needQuery,
}: {
  className?: string;
  queryKey: string;
  queryVal?: string[] | string;
  selectVal?: string[];
  multiple?: boolean;
  titleInput?: string;
  titleHide?: boolean;
  children?: React.ReactNode;
  readOnly?: boolean;
  needQuery?: boolean;
}) {
  const [index, indexSet] = useState<"z-0" | "z-10" | "z-20">("z-0");
  const [search, searchSet] = useState("");
  const [tmpval, tmpvalSet] = useState<string[]>([]);
  const [tmpselect, tmpselectSet] = useState(selectVal ? selectVal : []);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor focus
  useEffect(() => {
    if (index == "z-20") inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [index, search]);

  // Clear index set to zer0
  const clearIndex = () => {
    indexSet((prev) => {
      if (prev === "z-20") return "z-10";
      return "z-0";
    });
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(async () => {
      searchSet("");
      indexSet("z-0");
    }, 300);
  };

  // Skip if click outside
  useEffect(() => {
    searchSet("");
    const mousecFnc = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node))
        clearIndex();
    };
    document.addEventListener("mousedown", mousecFnc);
    return () => document.removeEventListener("mousedown", mousecFnc);
  }, []);

  // Handle input search
  const change = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    searchSet(e.target.value.toUpperCase());
  };

  // Manage indexing
  const xclick = () => {
    if (index == "z-0") {
      indexSet("z-20");
    } else clearIndex();
  };
  const xfocus = () => {
    if (index === "z-0") indexSet("z-20");
  };

  // Check query val for update
  useEffect(() => {
    tmpvalSet([]);
    if (queryVal) {
      if (Array.isArray(queryVal)) tmpvalSet(queryVal);
      else tmpvalSet([queryVal]);
    }
  }, [queryVal]);

  // Handle array
  const [queryReplace, _] = HandleQueryReplace();
  const select = (value: string | string[], remove?: boolean) => {
    searchSet("");
    if (multiple) {
      if (index == "z-20") inputRef.current?.focus();
      tmpvalSet((prev) => {
        // value berupa array
        if (Array.isArray(value)) {
          if (remove) {
            return prev.filter((item) => !value.includes(item));
          }
          return [...new Set([...prev, ...value])];
        }

        // value berupa string → toggle
        if (prev.includes(value)) {
          return prev.filter((item) => item !== value);
        }
        return [...prev, value];
      });
      return;
    }

    // single select
    if (!Array.isArray(value)) {
      tmpvalSet([value]);
      if (needQuery) queryReplace({ [queryKey]: value });
      clearIndex();
    }
  };

  // Check query val for update
  useEffect(() => {
    if (selectVal)
      tmpselectSet(
        search === ""
          ? selectVal
          : selectVal.filter((item) => item.toUpperCase().includes(search)),
      );
  }, [selectVal, search, tmpval]);

  return (
    <div
      className={`relative ${className ? className : "h-13 w-full px-1.5 py-3 md:h-15"} ${index}`}
      ref={divRef}
    >
      <div
        className={`relative z-10 flex h-full w-full cursor-pointer items-center justify-start rounded-lg px-3 ${
          readOnly
            ? "text-slate-400 ring ring-slate-400 select-none"
            : "bg-white ring ring-slate-200"
        }`}
        onClick={xclick}
      >
        <input
          ref={inputRef}
          type="text"
          className="absolute h-0 w-0 opacity-0"
          value={search}
          onChange={change}
          onFocus={xfocus}
        />
        {tmpval.map((val, idx) => (
          <input name={queryKey} type="hidden" value={val} key={idx} />
        ))}
        {children ?? <ChevronDownCircleIcon className="w-4 text-slate-400" />}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <input className="w-full" hidden />
          <div
            className={`pointer-events-none absolute left-0 flex h-full items-center px-1.5 font-semibold whitespace-nowrap duration-300 ${
              tmpval.length > 0 || search
                ? `-translate-y-3/4 text-slate-500 ${titleHide && "opacity-0"}`
                : "text-slate-500/70"
            }`}
          >
            {titleInput ?? "here"}
          </div>
          <div className="flex w-full items-center justify-start">
            <div
              className={`absolute w-full px-2 font-medium ${search ? "opacity-100" : "translate-x-5 opacity-0"} duration-300`}
            >
              {search}
            </div>
            <div
              className={`absolute w-full px-2 font-medium ${search ? "translate-x-5 opacity-0" : "opacity-100"} duration-300`}
            >
              {tmpval.length > 1 ? tmpval.length + " Selected" : tmpval}
            </div>
          </div>
        </div>
      </div>
      {multiple && (
        <div className="absolute top-0 right-0 flex h-full p-0.5">
          <AssetButton
            className="md aspect-square h-full"
            active="inactive"
            color="dark"
            type="button"
            action={() => select(tmpselect)}
          >
            <CheckCheck />
          </AssetButton>
          <AssetButton
            className="md aspect-square h-full"
            active="inactive"
            color="dark"
            type="button"
            action={() => select(tmpselect, true)}
          >
            <ListX />
          </AssetButton>
        </div>
      )}
      <div
        className={`absolute inset-0 z-0 translate-y-full select-none ${index != "z-20" ? "h-0" : "h-full"} duration-300`}
      >
        <div
          className={`mt-1 w-full overflow-y-scroll rounded-lg bg-slate-100 shadow-xl ring ring-slate-200 ${
            index == "z-20" ? "z-20 h-48 opacity-100" : "h-0 opacity-0"
          } duration-300`}
        >
          {tmpselect.map((val, idx) => (
            <label key={idx}>
              <input
                type="checkbox"
                id={`checkbox-${idx}`}
                checked={tmpval.includes(val)}
                onChange={() => select(val)}
                className="hidden"
              />
              <AssetButton
                className="flex h-1/4 w-full items-center p-1"
                color="dark"
                type="button"
                active={tmpval.includes(val) ? "active" : "inactive"}
                action={() => {
                  divRef.current
                    ?.querySelector<HTMLInputElement>(`#checkbox-${idx}`)
                    ?.click();
                }}
              >
                <span className="font-semibold">{val}</span>
              </AssetButton>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
