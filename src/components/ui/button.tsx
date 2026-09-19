import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    let variantStyles = "bg-gradient-to-r from-[#7FE87F] via-[#98F598] to-[#5FBF5F] text-[#080C14] hover:brightness-110 font-bold shadow-md shadow-[#7FE87F]/20 active:scale-[0.98]";

    if (variant === "destructive") {
      variantStyles = "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 font-semibold";
    } else if (variant === "outline") {
      variantStyles = "bg-[#111726] text-neutral-200 border border-[#2C2C44] hover:bg-[#182236] hover:text-[#7FE87F] hover:border-[#7FE87F]/40 font-medium";
    } else if (variant === "secondary") {
      variantStyles = "bg-[#182236] text-neutral-200 hover:bg-[#2A2A2A] font-semibold border border-[#3A3A52]";
    } else if (variant === "ghost") {
      variantStyles = "bg-transparent text-neutral-400 hover:text-[#7FE87F] hover:bg-[#182236]/50 font-medium";
    }

    let sizeStyles = "h-9 px-3.5 py-2 text-xs rounded-lg";

    if (size === "sm") {
      sizeStyles = "h-7 px-2.5 text-xs rounded-md";
    } else if (size === "lg") {
      sizeStyles = "h-11 px-5 text-sm rounded-xl";
    } else if (size === "icon") {
      sizeStyles = "h-8 w-8 p-0 rounded-lg";
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
