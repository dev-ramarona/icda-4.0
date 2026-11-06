import HeaderAsset from "@/assets/header";
import { ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { AssetIconMenu } from "@/assets/icon";
import { getAccessToken, verifyAccessToken } from "@/lib/session";

// Main page
export default async function Page() {
  const accessToken = await getAccessToken();
  const verifyToken = await verifyAccessToken(accessToken);
  return (
    <main className="h-full">
      <HeaderAsset title="Aplication list" desc="All of page you can access" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verifyToken.screens.map((val, idx) => {
            const Icon = AssetIconMenu[val.screenkey] ?? LayoutGrid;
            return (
              <Link
                className="flex h-48 flex-col items-start justify-between rounded-xl bg-slate-100 p-3 ring ring-white backdrop-blur-md duration-300 hover:-translate-y-1 hover:shadow-lg"
                key={idx}
                href={"private/" + val.screenkey}
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-200">
                    <Icon
                      className="h-10 w-10 rounded-xl bg-sky-200 p-2 text-sky-800 ring ring-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="pt-1.5 pb-1.5 text-lg font-semibold text-slate-600">
                    {val.title}
                  </div>
                  <div className="pb-3 text-sm text-slate-600">
                    {val.description}
                  </div>
                </div>
                <div className="border-accent-500 flex w-full justify-between border-t pt-1.5 pb-3 text-xs text-slate-400">
                  <div>{val.detail}</div>
                  <div>
                    <ChevronRight />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import {
//   Database,
//   Plane,
//   UserCog,
//   LucideIcon,
//   LayoutGrid,
//   Search,
//   ChevronRight,
// } from "lucide-react";

// // ================================
// // Tipe data menu
// // ================================
// type MenuItem = {
//   app: string;
//   description: string;
//   detail: string;
// };

// // ================================
// // Data menu
// // Tinggal tambahkan object baru di array ini kalau menu bertambah
// // ================================
// const MENU_LIST: MenuItem[] = [
//   {
//     app: "master_data",
//     description: "Centralized management of master and reference data",
//     detail: "Master Appendix data",
//   },
//   {
//     app: "flight_data",
//     description: "Flight related passenger and sales information",
//     detail: "Manifest & Sales data",
//   },
//   {
//     app: "user_config",
//     description: "User, role, permission, and access management",
//     detail: "User configuration",
//   },
// ];

// // ================================
// // Mapping icon per app (fallback ke LayoutGrid kalau tidak terdaftar)
// // ================================
// const ICON_MAP: Record<string, LucideIcon> = {
//   master_data: Database,
//   flight_data: Plane,
//   user_config: UserCog,
// };

// // ================================
// // Helper: ubah snake_case jadi Title Case untuk judul card
// // ================================
// function formatTitle(app: string) {
//   return app
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }

// // ================================
// // Warna aksen per index, biar tiap card ada variasi warna
// // ================================
// const ACCENT_COLORS = [
//   {
//     bg: "bg-blue-50",
//     icon: "text-blue-600",
//     ring: "group-hover:ring-blue-200",
//   },
//   {
//     bg: "bg-emerald-50",
//     icon: "text-emerald-600",
//     ring: "group-hover:ring-emerald-200",
//   },
//   {
//     bg: "bg-purple-50",
//     icon: "text-purple-600",
//     ring: "group-hover:ring-purple-200",
//   },
//   {
//     bg: "bg-amber-50",
//     icon: "text-amber-600",
//     ring: "group-hover:ring-amber-200",
//   },
//   {
//     bg: "bg-rose-50",
//     icon: "text-rose-600",
//     ring: "group-hover:ring-rose-200",
//   },
//   {
//     bg: "bg-cyan-50",
//     icon: "text-cyan-600",
//     ring: "group-hover:ring-cyan-200",
//   },
// ];

// export default function MenuPage() {
//   const [query, setQuery] = useState("");

//   const filteredMenu = MENU_LIST.filter((item) => {
//     const q = query.toLowerCase();
//     return (
//       item.app.toLowerCase().includes(q) ||
//       item.description.toLowerCase().includes(q) ||
//       item.detail.toLowerCase().includes(q)
//     );
//   });

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-6xl px-6 py-10">
//         {/* Header */}
//         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Menu Aplikasi
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Pilih menu di bawah untuk masuk ke halaman terkait
//             </p>
//           </div>

//           {/* Search box */}
//           <div className="relative w-full sm:w-72">
//             <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Cari menu..."
//               className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>
//         </div>

//         {/* Grid menu */}
//         {filteredMenu.length > 0 ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {filteredMenu.map((item, index) => {
//               const Icon = ICON_MAP[item.app] ?? LayoutGrid;
//               const color = ACCENT_COLORS[index % ACCENT_COLORS.length];

//               return (
//                 <Link
//                   key={item.app}
//                   href={`/${item.app.replace(/_/g, "-")}`}
//                   className={`group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-md ${color.ring}`}
//                 >
//                   <div>
//                     <div
//                       className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color.bg}`}
//                     >
//                       <Icon
//                         className={`h-5 w-5 ${color.icon}`}
//                         strokeWidth={2}
//                       />
//                     </div>

//                     <h2 className="text-base font-semibold text-gray-900">
//                       {formatTitle(item.app)}
//                     </h2>
//                     <p className="mt-1 text-sm text-gray-500">
//                       {item.description}
//                     </p>
//                   </div>

//                   <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
//                     <span className="text-xs font-medium text-gray-400">
//                       {item.detail}
//                     </span>
//                     <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
//             Menu tidak ditemukan untuk pencarian "{query}"
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
