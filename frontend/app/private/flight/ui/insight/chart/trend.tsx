import { memo, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InsightTypeTrend, queryFlightType } from "../../../models/model";
import { LibFormatNumber } from "@/lib/format";
import {
  AssetLayoutScrolly,
  AssetLayoutTable,
  AssetLayoutTbodym,
  AssetLayoutTbodyl,
  AssetLayoutThead,
} from "@/assets/layout";
import { LibHookMobile } from "@/lib/hook";
import { LibChartDomain } from "@/lib/chart";
import { AssetSelect } from "@/assets/input";
import { ArrowUpDownIcon } from "lucide-react";

export default function TrendChartInsight({
  querys,
  dataInsight,
  expanded,
}: {
  querys: queryFlightType;
  dataInsight: InsightTypeTrend[];
  expanded: boolean;
}) {
  // Select dimension
  const val = useMemo(() => {
    if (querys.trend_metric === "profit") {
      return { bar: "profit", linea: "", lineb: "lf" };
    } else if (querys.trend_metric === "rev")
      return { bar: "rev", linea: "cost", lineb: "flight" };
    return { bar: "rph", linea: "cph", lineb: "lf" };
  }, [querys]);

  // use memo
  const isMobile = LibHookMobile();
  const dataNow = useMemo(() => {
    if (!isMobile) return dataInsight;
    const allowedKeys = ["dot", "lf", val.bar, val.linea, val.lineb];
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
            <div className="text-lg font-semibold">
              {querys.trend_metric == "profit"
                ? "Trend Profit"
                : querys.trend_metric == "rev"
                  ? "Trend Revenue VS Cost VS Flight"
                  : "Trend Revenue/Hour VS LF VS Cost/hour"}
            </div>
            <div>
              From {querys.insight_dot} to previous {dataNow.length - 1} day
            </div>
          </div>
          <div className="flex gap-3">
            <AssetSelect
              className="h-8 w-25"
              queryKey="trend_metric"
              titleInput="Metric"
              selectVal={["profit", "rev", "rph"]}
              queryVal={querys.trend_metric}
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
                          ? col + "%"
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
  const [animate, setAnimate] = useState(true);
  useEffect(() => setAnimate(true), [data]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revHight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="50%" stopColor={COLOR_REVH_START} />
            <stop offset="100%" stopColor={COLOR_REVH_END} />
          </linearGradient>
          <linearGradient id="revLow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor={COLOR_REVL_START} />
            <stop offset="100%" stopColor={COLOR_REVL_END} />
          </linearGradient>
          <linearGradient id="loadFactor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor={COLOR_REVL_END} />
            <stop offset="100%" stopColor={COLOR_REVH_END} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="#cad5e2"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis dataKey="dot" axisLine={false} />
        <YAxis
          yAxisId="left"
          orientation="left"
          width="auto"
          tickLine={false}
          axisLine={false}
          domain={LibChartDomain(
            data.map((item) => item[val.linea]),
            0,
          )}
          tickFormatter={(value) => LibFormatNumber(value, 0)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          width="auto"
          tickLine={false}
          axisLine={false}
          domain={LibChartDomain(data.map((item) => item[val.lineb]))}
        />
        <Tooltip formatter={(value) => LibFormatNumber(Number(value), 2)} />
        <Legend />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={val.lineb}
          stroke={"url(#loadFactor)"}
          strokeWidth={4}
          dot={{ r: 3, fill: "white", strokeWidth: 3 }}
          isAnimationActive={animate}
          onAnimationEnd={() => setAnimate(false)}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={val.linea}
          stroke={COLOR_REVL_START}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          strokeDasharray="5 3"
          isAnimationActive={animate}
        />
        <Bar
          yAxisId="left"
          dataKey={val.bar}
          fill="url(#revHight)"
          radius={[7, 7, 0, 0]}
          shape={(props) => (
            <Rectangle
              {...props}
              fill={
                props.payload[val.bar] < (props.payload[val.linea] ?? 0)
                  ? "url(#revLow)"
                  : "url(#revHight)"
              }
            />
          )}
          isAnimationActive={animate}
        >
          <LabelList
            dataKey="day"
            fill="#fff"
            formatter={(d) => (d == "Sat" || d == "Sun" ? d : "")}
            angle={-90}
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
//   dataInsight: InsightTypeTrend[];
//   expanded: boolean;
// }) {
//   // use memo
//   const isMobile = LibHookMobile();
//   const dataNow = useMemo(() => {
//     if (!isMobile) return dataInsight;
//     const allowedKeys = ["dot", "lf", "rph", "cph"];
//     return dataInsight
//       .slice(-11)
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
//         className={`flex w-full flex-col items-start justify-center ${expanded ? "h-2/3 md:h-full" : "h-full"}`}
//       >
//         <div className="flex w-full flex-col items-center justify-between gap-y-3 pb-3 text-center text-slate-600 md:flex-row md:text-left">
//           <div>
//             <div className="text-base font-semibold md:text-lg">
//               Trend revenue per Hour VS Load Factor
//             </div>
//             <div>
//               From {querys.insight_dot} to previous{" "}
//               {dataNow.length - 1} day
//             </div>
//           </div>
//         </div>
//         <div className="h-full w-full">
//           <Chartx data={dataNow} dataInsight={dataInsight} />
//         </div>
//       </div>

//       {/* Table */}
//       <div
//         className={`${expanded ? "h-1/3 w-full opacity-100 md:h-full md:w-1/2 md:p-3" : "h-0 w-0 opacity-0"} duration-300`}
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
//                         {["seat", "pax", "rph", "cph", "rev", "rpp"].includes(
//                           key,
//                         )
//                           ? LibFormatNumber(col)
//                           : col}
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
// const Chartx = memo(function Chartx({
//   data,
//   dataInsight,
// }: {
//   data: any[];
//   dataInsight: any[];
// }) {
//   const COLOR_REVH_START = "#005f78";
//   const COLOR_REVH_END = "#00b8db";
//   const COLOR_REVL_START = "#ef4444";
//   const COLOR_REVL_END = "#ffd230";
//   const [animate, setAnimate] = useState(true);
//   useEffect(() => setAnimate(true), [data]);
//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
//         <defs>
//           <linearGradient id="revHight" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="50%" stopColor={COLOR_REVH_START} />
//             <stop offset="100%" stopColor={COLOR_REVH_END} />
//           </linearGradient>
//           <linearGradient id="revLow" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="30%" stopColor={COLOR_REVL_START} />
//             <stop offset="100%" stopColor={COLOR_REVL_END} />
//           </linearGradient>
//           <linearGradient id="loadFactor" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="30%" stopColor={COLOR_REVL_END} />
//             <stop offset="100%" stopColor={COLOR_REVH_END} />
//           </linearGradient>
//         </defs>

//         <CartesianGrid
//           stroke="#cad5e2"
//           strokeDasharray="3 3"
//           vertical={false}
//         />
//         <XAxis dataKey="dot" axisLine={false} />
//         <YAxis
//           yAxisId="left"
//           orientation="left"
//           width="auto"
//           tickLine={false}
//           axisLine={false}
//           domain={LibChartDomain(dataInsight.map((item) => item.rph))}
//           tickFormatter={(value) => LibFormatNumber(value, 0)}
//         />
//         <YAxis
//           yAxisId="right"
//           orientation="right"
//           width="auto"
//           tickLine={false}
//           axisLine={false}
//           domain={LibChartDomain(dataInsight.map((item) => item.lf))}
//           tickFormatter={(v: number) => `${Math.round(v)}%`}
//         />
//         <Tooltip />
//         <Legend />
//         <Line
//           yAxisId="right"
//           type="monotone"
//           dataKey="lf"
//           name="Load Factor"
//           stroke={"url(#loadFactor)"}
//           strokeWidth={4}
//           dot={{ r: 3, fill: "white", strokeWidth: 3 }}
//           isAnimationActive={animate}
//           onAnimationEnd={() => setAnimate(false)}
//         />
//         <Line
//           yAxisId="left"
//           type="monotone"
//           dataKey="cph"
//           name="Cost perHour"
//           stroke={COLOR_REVL_START}
//           strokeWidth={2}
//           dot={false}
//           activeDot={{ r: 4 }}
//           strokeDasharray="5 3"
//           isAnimationActive={animate}
//         />
//         <Bar
//           yAxisId="left"
//           dataKey="rph"
//           fill="url(#revHight)"
//           radius={[7, 7, 0, 0]}
//           shape={(props) => (
//             <Rectangle
//               {...props}
//               fill={
//                 props.payload.rph < props.payload.cph
//                   ? "url(#revLow)"
//                   : "url(#revHight)"
//               }
//             />
//           )}
//           isAnimationActive={animate}
//         >
//           <LabelList
//             dataKey="day"
//             fill="#fff"
//             formatter={(d) => (d == "Sat" || d == "Sun" ? d : "")}
//             angle={-90}
//           />
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   );
// });
