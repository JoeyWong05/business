import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "h-2 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      color: {
        default: "",
        blue: "",
        green: "",
        amber: "",
        red: "",
        purple: "",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all",
  {
    variants: {
      color: {
        default: "bg-primary",
        blue: "bg-blue-500",
        green: "bg-green-500",
        amber: "bg-amber-500",
        red: "bg-red-500",
        purple: "bg-purple-500",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

export interface CustomProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  color?: "default" | "blue" | "green" | "amber" | "red" | "purple";
}

const CustomProgress = React.forwardRef<HTMLDivElement, CustomProgressProps>(
  ({ className, value, max = 100, color = "default", ...props }, ref) => {
    const percentage = (value / max) * 100;
    
    return (
      <div
        ref={ref}
        className={cn(progressVariants({ color }), className)}
        {...props}
      >
        <div
          className={cn(progressIndicatorVariants({ color }))}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
    );
  }
);

CustomProgress.displayName = "CustomProgress";

export { CustomProgress };