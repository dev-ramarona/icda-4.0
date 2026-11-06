type colorPallete = "warning" | "dark" | "danger";
const colorStyle: Record<colorPallete, { base: string; hover: string }> = {
  dark: {
    base: "bg-linear-60 from-sky-800 to-gray-800",
    hover: "bg-linear-120 from-sky-700 via-cyan-700 to-gray-700",
  },
  warning: {
    base: "bg-linear-60 from-orange-600 to-amber-600",
    hover: "bg-linear-120 from-orange-600 via-yellow-600 to-amber-600",
  },
  danger: {
    base: "bg-linear-60 from-fuchsia-600 to-red-600",
    hover: "bg-linear-120 from-fuchsia-600 via-pink-600 to-red-600",
  },
};
export default function AssetButton({
  action,
  children,
  className,
  active,
  disabled,
  color,
  type,
}: {
  action?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  active?: "active" | "inactive" | "pasive";
  disabled?: boolean;
  color: colorPallete;
  type?: "reset" | "button" | "submit";
}) {
  const styles = colorStyle[color];
  return (
    <div
      className={`relative ${className ? className : "h-11 w-1/2 px-1.5 py-3 md:h-13 md:w-36 md:max-w-1/2"}`}
    >
      <button
        className={`flex h-full w-full items-center text-slate-600 ${
          active != "inactive" ? "text-white" : ""
        } group relative cursor-pointer overflow-hidden rounded-xl duration-300 hover:-translate-y-0.5 hover:shadow-md`}
        onClick={action}
        disabled={disabled}
        type={type}
      >
        <div
          className={`absolute h-full w-full ${styles.base} ${
            active == "inactive" && "opacity-0 group-hover:opacity-30"
          } duration-300`}
        />
        <div
          className={`absolute h-full w-full opacity-0 duration-300 group-hover:opacity-100 ${
            active != "inactive" && styles.hover
          }`}
        />
        <div
          className={`absolute flex w-full items-center p-1.5 ${
            active == "pasive" && "justify-center font-semibold"
          }`}
        >
          {children}
        </div>
      </button>
    </div>
  );
}
