import { AssetSelect } from "@/assets/input";
import { ArrowUpDownIcon } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InsightTypeTbucket, queryFlightType } from "../../../models/model";
import { LibFormatNumber, LibFormatPercent } from "@/lib/format";
import {
  AssetLayoutScrolly,
  AssetLayoutTable,
  AssetLayoutTbodyl,
  AssetLayoutTbodym,
  AssetLayoutThead,
} from "@/assets/layout";
import { LibHookMobile } from "@/lib/hook";

export default function TbucketChartInsight({
  querys,
  dataInsight,
  expanded,
}: {
  querys: queryFlightType;
  dataInsight: InsightTypeTbucket[];
  expanded: boolean;
}) {
  // Select dimension
  const suffix = querys.tbucket_period === "daily" ? "daily" : "monthly";
  const val = useMemo(() => {
    if (querys.tbucket_value === "rph")
      return { bar: `rph_${suffix}`, min: `cph_${suffix}` };
    else if (querys.tbucket_value === "profit")
      return { bar: `profit_${suffix}`, min: `x_${suffix}` };
    return { bar: `lf_${suffix}`, min: `xx_${suffix}` };
  }, [querys]);

  // use memo
  const isMobile = LibHookMobile();
  const dataNow = useMemo(() => {
    if (!isMobile) return dataInsight;
    const allowedKeys = [
      "tbucket",
      val.bar,
      `flight_${suffix}`,
      `seat_${suffix}`,
      `pax_${suffix}`,
      // `lf_${suffix}`,
      // `rph_${suffix}`,
    ];
    return dataInsight
      .slice(-10)
      .map((item) =>
        Object.fromEntries(
          Object.entries(item).filter(([key]) => allowedKeys.includes(key)),
        ),
      );
  }, [isMobile, dataInsight, val]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden md:flex-row">
      {/* Chart and input */}
      <div
        className={`flex w-full flex-col items-start justify-center ${expanded ? "h-2/3 md:h-full" : "h-full"}`}
      >
        <div className="flex w-full flex-col items-center justify-between gap-y-3 pb-3 text-center text-slate-600 md:items-start md:text-left">
          <div>
            <div className="text-lg font-semibold">Time bucket</div>
            <div>
              {querys.tbucket_period == "daily"
                ? "Daily Rev/hr " + querys.insight_dot
                : "Monthly Score " + querys.insight_dot + " To (-30) day"}
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-center md:justify-start">
            <AssetSelect
              className="h-9 w-25 max-w-1/2 p-1"
              queryKey="tbucket_period"
              titleInput="Daily or 30 Day"
              selectVal={["daily", "monthly"]}
              queryVal={querys.tbucket_period}
              needQuery={true}
            >
              <ArrowUpDownIcon className="text-slate-400" />
            </AssetSelect>
            <AssetSelect
              className="h-9 w-25 max-w-1/2 p-1"
              queryKey="tbucket_value"
              titleInput="RPH or Score"
              selectVal={["lf", "rph", "profit"]}
              queryVal={querys.tbucket_value}
              needQuery={true}
            >
              <ArrowUpDownIcon className="text-slate-400" />
            </AssetSelect>
          </div>
        </div>
        <div className="h-full w-full">
          <Chartx data={dataNow} val={val} />
        </div>
      </div>

      {/* Table */}
      <div
        className={`${expanded ? "h-1/3 w-full opacity-100 md:h-full md:w-1/2 md:p-3" : "h-0 w-0 opacity-0"} duration-300`}
      >
        <AssetLayoutScrolly className="h-full w-full p-3">
          <AssetLayoutTable>
            <AssetLayoutThead object={dataNow[0]} stickyl={"active"} />
            <tbody>
              {dataNow.map((row, key) => (
                <tr key={key}>
                  {Object.entries(row || {}).map(([key, col], idx) =>
                    idx == 0 ? (
                      <AssetLayoutTbodyl key={key}>{col}</AssetLayoutTbodyl>
                    ) : (
                      <AssetLayoutTbodym key={key}>
                        {[
                          "lf_daily",
                          "lf_monthly",
                          "profit_prstnc_daily",
                          "loss_prstnc_daily",
                          "profit_prstnc_monthly",
                          "loss_prstnc_monthly",
                        ].includes(key)
                          ? LibFormatPercent(col, 2)
                          : typeof col == "number"
                            ? LibFormatNumber(col)
                            : col}
                      </AssetLayoutTbodym>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </AssetLayoutTable>
        </AssetLayoutScrolly>
      </div>
    </div>
  );
}

// Chart
const Chartx = memo(function Chartx({ data, val }: { data: any[]; val: any }) {
  const COLOR_REVH_START = "#005f78";
  const COLOR_REVH_END = "#00b8db";
  const COLOR_REVL_START = "#ef4444";
  const COLOR_REVL_END = "#ffd230";
  const [animate, animateSet] = useState(true);
  useEffect(() => animateSet(true), [data]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart responsive data={data} layout="vertical" barGap={0}>
        <defs>
          <linearGradient id="tbucketh" x1="1" y1="0" x2="0" y2="0">
            <stop offset="50%" stopColor={COLOR_REVH_START} />
            <stop offset="100%" stopColor={COLOR_REVH_END} />
          </linearGradient>
          <linearGradient id="tbucketl" x1="1" y1="0" x2="0" y2="0">
            <stop offset="50%" stopColor={COLOR_REVL_START} />
            <stop offset="100%" stopColor={COLOR_REVL_END} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="#cad5e2"
          strokeDasharray="3 3"
          horizontal={false}
        />
        <YAxis
          fontSize={10}
          interval={0}
          type="category"
          dataKey="tbucket"
          width="auto"
          axisLine={false}
        />
        <XAxis
          type="number"
          axisLine={false}
          tickFormatter={(v) => LibFormatNumber(v)}
        />
        <Tooltip formatter={(value) => LibFormatNumber(Number(value), 2)} />
        <Bar
          dataKey={val.bar}
          fill="url(#tbucketh)"
          radius={[0, 7, 7, 0]}
          shape={(props) => (
            <Rectangle
              {...props}
              fill={
                props.payload[val.bar] < (props.payload[val.min] ?? 0)
                  ? "url(#tbucketl)"
                  : "url(#tbucketh)"
              }
            />
          )}
          isAnimationActive={animate}
        >
          <LabelList
            dataKey={val.bar}
            fill="#fff"
            formatter={(d) => LibFormatNumber(Number(d), 2)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

//   querys,
//   dataInsight,
//   expanded,
// }: {
//   querys: queryFlightType;
//   dataInsight: InsightTypeTbucket[];
//   expanded: boolean;
// }) {
//   // use memo
//   const isMobile = LibHookMobile();
//   const dataNow = useMemo(() => {
//     if (!isMobile) return dataInsight;
//     const allowedKeys = ["time", "flight", "lf", "rph", "cph"];
//     return dataInsight
//       .slice(-10)
//       .map((item) =>
//         Object.fromEntries(
//           Object.entries(item).filter(([key]) => allowedKeys.includes(key)),
//         ),
//       );
//   }, [isMobile, dataInsight]);
//   return (
//     <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden md:flex-row">
//       {/* Chart and input */}
//       <div
//         className={`flex w-full flex-col items-start justify-center ${expanded ? "h-1/2 md:h-full" : "h-full"}`}
//       >
//         <div className="flex w-full items-center justify-between pb-3 text-slate-600">
//           <div>
//             <div className="text-lg font-semibold">Time bucket</div>
//             <div>Display data {querys.insight_dot}</div>
//           </div>
//         </div>
//         <div className="h-full w-full">
//           <Chartx data={dataNow} />
//         </div>
//       </div>

//       {/* Table */}
//       <div
//         className={`${expanded ? "h-1/2 w-full opacity-100 md:h-full md:w-1/2 md:p-3" : "h-0 w-0 opacity-0"} duration-300`}
//       >
//         <AssetLayoutScrolly className="h-full w-full p-3">
//           <AssetLayoutTable>
//             <AssetLayoutThead object={dataNow[0]} stickyl={"active"} />
//             <tbody>
//               {dataNow.map((row, key) => (
//                 <tr key={key}>
//                   {Object.entries(row || {}).map(([key, col], idx) =>
//                     idx == 0 ? (
//                       <AssetLayoutTbodyl key={key}>{col}</AssetLayoutTbodyl>
//                     ) : (
//                       <AssetLayoutTbodym key={key}>
//                         {["seat", "pax", "rev", "rpp", "cph"].includes(key)
//                           ? LibFormatNumber(col)
//                           : ["rph"].includes(key)
//                             ? LibFormatNumber(col)
//                             : col}
//                       </AssetLayoutTbodym>
//                     ),
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </AssetLayoutTable>
//         </AssetLayoutScrolly>
//       </div>
//     </div>
//   );
// }

// // Chart
// const Chartx = memo(function Chartx({ data }: { data: any[] }) {
//   const COLOR_REVH_START = "#005f78";
//   const COLOR_REVH_END = "#00b8db";
//   const [animate, setAnimate] = useState(true);
//   useEffect(() => setAnimate(true), [data]);
//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <BarChart responsive data={data} layout="vertical">
//         <defs>
//           <linearGradient id="toptenbg" x1="1" y1="0" x2="0" y2="0">
//             <stop offset="50%" stopColor={COLOR_REVH_START} />
//             <stop offset="100%" stopColor={COLOR_REVH_END} />
//           </linearGradient>
//         </defs>

//         <CartesianGrid
//           stroke="#cad5e2"
//           strokeDasharray="3 3"
//           horizontal={false}
//         />
//         <YAxis
//           fontSize={10}
//           interval={0}
//           type="category"
//           dataKey="tbucket"
//           width="auto"
//           axisLine={false}
//         />
//         <XAxis
//           type="number"
//           axisLine={false}
//           tickFormatter={(v: number) => `${Math.round(v)}%`}
//         />
//         <Tooltip />
//         <Bar
//           dataKey="lf"
//           fill="url(#toptenbg)"
//           radius={[0, 7, 7, 0]}
//           isAnimationActive={animate}
//           onAnimationEnd={() => setAnimate(false)}
//         >
//           <LabelList
//             dataKey="lf"
//             fill="#fff"
//             formatter={(v) => `${v}%`}
//             position={"insideRight"}
//           />
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// });
