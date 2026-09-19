import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  let variantStyles = "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35";

  if (variant === "secondary") {
    variantStyles = "bg-[#212121] text-neutral-300 border border-[#333333]";
  } else if (variant === "destructive") {
    variantStyles = "bg-red-500/15 text-red-400 border border-red-500/30";
  } else if (variant === "warning") {
    variantStyles = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
  } else if (variant === "success") {
    variantStyles = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  } else if (variant === "outline") {
    variantStyles = "bg-transparent text-neutral-300 border border-[#333333]";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}
