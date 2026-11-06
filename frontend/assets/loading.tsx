import AssetButton from "@/assets/button";
export function AssetLoading({
  show,
  size,
}: {
  show: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "scale-75" : size === "md" ? "scale-100" : "scale-125";
  const items = ["dark", "danger", "dark"] as const;
  return (
    <div
      className={`fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center gap-2 overflow-hidden ${
        !show && "pointer-events-none opacity-0 select-none"
      } duration-300 ease-in-out ${sizeClass}`}
    >
      {items.map((color, i) => (
        <div
          key={i}
          className="wave"
          style={{ animationDelay: `${-i * 0.2}s` }}
        >
          <AssetButton className={`aspect-square w-10`} color={color} />
        </div>
      ))}
    </div>
  );
}

export function AssetLoadingMini({
  show,
  size,
}: {
  show: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "scale-75" : size === "md" ? "scale-100" : "scale-100";
  const items = ["dark", "danger", "dark"] as const;
  return (
    <div
      className={`absolute top-0 left-0 z-30 flex h-full w-full items-center justify-center gap-2 overflow-hidden ${
        !show && "pointer-events-none opacity-0 select-none"
      } duration-300 ease-in-out ${sizeClass}`}
    >
      {items.map((color, i) => (
        <div
          key={i}
          className="wave"
          style={{ animationDelay: `${-i * 0.2}s` }}
        >
          <AssetButton className={`aspect-square w-10`} color={color} />
        </div>
      ))}
    </div>
  );
}
