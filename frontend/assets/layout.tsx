// Layout scroolable
export function AssetLayoutFix({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-slate-100 p-3 ring ring-white ${className ?? "h-full w-full"}`}
    >
      <div className="relative h-full w-full rounded-xl">{children}</div>
    </div>
  );
}

// Layout scroolable
export function AssetLayoutScrolly({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full rounded-xl bg-slate-100 ring ring-white ${className ? className : "h-full p-1"}`}
    >
      <div className="relative z-10 h-full w-full overflow-auto rounded-xl">
        {children}
      </div>
    </div>
  );
}

// Layout grid
export default function AssetLayoutGrid({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section className="p-3">
      <div className="relative flex flex-col gap-3 rounded-xl">
        <div className="w-full text-center text-base font-semibold">
          {label}
        </div>
        {children}
      </div>
    </section>
  );
}

// Layout table
export function AssetLayoutTable({ children }: { children: React.ReactNode }) {
  return <table className="mx-auto md:w-max">{children}</table>;
}

// Layout thead
export function AssetLayoutThead({
  object,
  stickyr,
  stickyl,
}: {
  object: object;
  stickyr?: string[] | "active";
  stickyl?: string[] | "active";
}) {
  const fncStickyl = (val: string, idx: number) => {
    return (
      <th
        className="sticky top-0 left-0 z-20 border-b border-slate-200 bg-slate-100 px-3"
        key={idx}
      >
        {val.toUpperCase()}
      </th>
    );
  };
  const fncStickyr = (val: string, idx: number) => {
    return (
      <th
        className="sticky top-0 right-0 z-20 border-b border-slate-200 bg-slate-100 px-3"
        key={idx}
      >
        {val.toUpperCase()}
      </th>
    );
  };
  return (
    <thead>
      <tr className="h-10">
        {Array.isArray(stickyl) &&
          stickyl?.map((val, idx) => fncStickyl(val, idx))}
        {Object.keys(object || {}).map((val, idx) => {
          if (stickyl == "active" && idx == 0) {
            return fncStickyl(val, idx);
          } else if (
            stickyr == "active" &&
            idx == Object.keys(object).length - 1
          ) {
            return fncStickyr(val, idx);
          } else
            return (
              <th
                className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 px-3"
                key={idx}
              >
                {val.toUpperCase().replaceAll("_", "\n")}
              </th>
            );
        })}
        {Array.isArray(stickyr) &&
          stickyr?.map((val, idx) => fncStickyr(val, idx))}
      </tr>
    </thead>
  );
}

// Layout Table body mid
export function AssetLayoutTbodym({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-b border-slate-200 p-3 align-middle">
      <div className="flex w-full flex-wrap items-center justify-center gap-2 md:max-w-80">
        {children}
      </div>
    </td>
  );
}

// Layout Table body right
export function AssetLayoutTbodyr({ children }: { children: React.ReactNode }) {
  return (
    <td className="sticky right-0 border-b border-l border-white bg-slate-100 p-3 drop-shadow-md">
      <div className="flex flex-col items-center justify-center gap-1.5 whitespace-nowrap md:flex-row">
        {children}
      </div>
    </td>
  );
}

// Layout Table body right
export function AssetLayoutTbodyl({ children }: { children: React.ReactNode }) {
  return (
    <td className="sticky left-0 border-b border-l border-white bg-slate-100 p-3 drop-shadow-md">
      <div className="flex flex-col items-center justify-center gap-1.5 whitespace-nowrap md:flex-row">
        {children}
      </div>
    </td>
  );
}

export function AssetLayoutBtext({
  className,
  str,
}: {
  className?: string;
  str?: string | number | boolean;
}) {
  return (
    <div
      className={`w-full wrap-break-word whitespace-normal ${className ?? "max-w-44"}`}
    >
      {str}
    </div>
  );
}

// Layout break long text
