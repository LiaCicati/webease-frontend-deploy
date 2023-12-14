import * as React from "react";

import { cn } from "@/utils/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const fileInputClasses =
      type === "file" ? "cursor-pointer shadow-sm text-customBlue" : "";
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 mt-2 w-full rounded-md bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-customBlue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          {
            "border border-slate-200 ring-offset-white dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300":
              type !== "file",
            "file:cursor-pointer file:shadow-none file:text-customBlue file:font-medium":
              type === "file",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
