"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

// Manage query
export function HandleQueryReplace() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const replace = (
    params: Record<string, string | null>,
    replaceAll: boolean = false,
  ) => {
    const currentParams = new URLSearchParams(window.location.search);
    const setprm = new URLSearchParams(replaceAll ? undefined : currentParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") setprm.delete(key);
      else setprm.set(key, value);
    });
    const query = setprm.toString();
    const pathName = window.location.pathname;
    startTransition(() => {
      router.push(query ? `${pathName}?${query}` : pathName, { scroll: false });
    });
  };

  return [replace, isPending] as const;
}

// lib/pagination.ts
export function LibPageArray(
  currentPage: number,
  totalPage: number,
  showPage: number,
): number[] {
  if (totalPage <= 0 || showPage <= 0) return [];
  const page = Math.min(Math.max(currentPage, 1), totalPage);
  const group = Math.ceil(page / showPage);
  const start = (group - 1) * showPage + 1;
  const end = Math.min(start + showPage - 1, totalPage);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// export function HandleQueryReset() {
//   const searchParam = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();
//   return function (queryx: string) {
//     const setprm = new URLSearchParams(searchParam);
//     for (const key of [...setprm.keys()])
//       if (key.includes(queryx)) setprm.delete(key);
//     router.push(`${pathName}?${setprm.toString()}`, { scroll: false });
//   };
// }
