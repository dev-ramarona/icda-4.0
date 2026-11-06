"use client";

import { HandleQueryReplace, LibPageArray } from "@/lib/query";
import { AssetSelect } from "./input";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import AssetButton from "./button";
import { useEffect, useRef, useState } from "react";
import { AssetLoading } from "./loading";

export default function AssetPagination({
  total,
  limit,
  currentPage,
  queryKey,
}: {
  total: number;
  limit: number;
  currentPage: number;
  queryKey: string;
}) {
  // Get maximal page number to display
  const itemWidth = 200; // perkiraan lebar 1 item pagination (px)
  const defShowPages = 3;
  const divRef = useRef<HTMLDivElement>(null);
  const [showPages, setShowPages] = useState(defShowPages);
  useEffect(() => {
    const element = divRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setShowPages(Math.max(1, Math.floor(width / itemWidth)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [total]);

  // Set waiting state
  const [temporary, temporarySet] = useState(0);
  useEffect(() => {
    temporarySet(0);
  }, [currentPage]);

  // Manage query
  const [handleQuery, waiting] = HandleQueryReplace();
  const totalPages = Math.ceil(total / limit);
  const arrayPage = LibPageArray(currentPage, totalPages, showPages);
  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages || page == currentPage) return;
    temporarySet(page);
    handleQuery({ [queryKey]: page.toString() });
  };

  return (
    <div
      className="relative flex h-fit items-center justify-center"
      ref={divRef}
    >
      <AssetLoading show={waiting} size="sm" />
      <div className="z-20 w-full rounded-xl bg-slate-100 p-1">
        <div className="flex w-full flex-col items-center justify-between px-3 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="whitespace-nowrap">Rows Per Page</div>
            <AssetSelect
              className="h-7 w-14"
              titleHide={true}
              queryKey="limit"
              selectVal={["5", "10", "15", "20"]}
              queryVal={limit.toString()}
              needQuery={true}
            >
              <ChevronDown className="w-4 text-slate-400" />
            </AssetSelect>
            <div className="whitespace-nowrap">
              {(currentPage - 1) * limit + 1} -
              {Math.min(currentPage * limit, total)} of {total}
              Rows
            </div>
          </div>
          <div className="flex items-center gap-3 p-1">
            <AssetButton
              className="h-7 w-8"
              color="dark"
              active="inactive"
              action={() => handlePage(1)}
              disabled={currentPage == 1}
            >
              <ChevronsLeft
                className={`${currentPage == 1 && "text-slate-300"}`}
              />
            </AssetButton>
            <AssetButton
              className="h-7 w-8"
              color="dark"
              active="inactive"
              action={() => handlePage(currentPage - 1)}
              disabled={currentPage == 1}
            >
              <ChevronLeft
                className={`${currentPage == 1 && "text-slate-300"}`}
              />
            </AssetButton>
            {arrayPage.map((page) => (
              <AssetButton
                className="h-7 w-8"
                color="dark"
                active={page == currentPage ? "active" : "inactive"}
                action={() => handlePage(page)}
                key={page}
              >
                <div
                  className={`w-full rounded-xl text-center ${page === temporary && "ring-2 ring-slate-700"} duration-300`}
                >
                  {page}
                </div>
              </AssetButton>
            ))}
            <AssetButton
              className="h-7 w-8"
              color="dark"
              active="inactive"
              action={() => {
                handlePage(Number(currentPage) + 1);
              }}
              disabled={currentPage == totalPages}
            >
              <ChevronRight
                className={`${currentPage == totalPages && "text-slate-300"}`}
              />
            </AssetButton>
            <AssetButton
              className="h-7 w-8"
              color="dark"
              active="inactive"
              action={() => handlePage(totalPages)}
              disabled={currentPage == totalPages}
            >
              <ChevronsRight
                className={`${currentPage == totalPages && "text-slate-300"}`}
              />
            </AssetButton>
          </div>
        </div>
      </div>
    </div>
    // <AssetLayoutScrolly className="h-fit p-1">
    //   <div className="flex items-center justify-between px-3">
    //     {/* Total data */}
    //     <div className="flex">
    //       <AssetSelect
    //         className="h-7 w-full"
    //         titleHide={true}
    //         queryKey="formats"
    //         titleInput="e.g Praboro Subianto"
    //         selectVal={["5", "10", "15", "20"]}
    //         queryVal={limit.toString()}
    //       >
    //         <ChevronDownCircleIcon className="w-4 text-slate-400" />
    //       </AssetSelect>
    //     </div>

    //     {/* Pagination */}
    //     <div className="flex items-center gap-1">
    //       {/* Previous */}
    //       <button
    //         onClick={() => handlePage(currentPage - 1)}
    //         disabled={currentPage === 1}
    //         className="rounded border px-3 py-2 disabled:opacity-50"
    //       >
    //         Previous
    //       </button>

    //       {/* Page */}
    //       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    //         <button
    //           key={page}
    //           onClick={() => handlePage(page)}
    //           className={`rounded border px-3 py-2 ${
    //             page === currentPage ? "bg-black text-white" : ""
    //           }`}
    //         >
    //           {page}
    //         </button>
    //       ))}

    //       {/* Next */}
    //       <button
    //         onClick={() => handlePage(currentPage + 1)}
    //         disabled={currentPage === totalPages}
    //         className="rounded border px-3 py-2 disabled:opacity-50"
    //       >
    //         Next
    //       </button>
    //     </div>
    //   </div>
    // </AssetLayoutScrolly>
  );
}
