"use client";

import * as React from "react";
import { DayPicker as ReactDayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";

import "react-day-picker/dist/style.css";

const Calendar = React.forwardRef<HTMLDivElement, DayPickerProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-2xl border border-border bg-popover text-popover-foreground shadow-sm", className)}>
    <ReactDayPicker
      className="w-full rounded-2xl bg-popover text-popover-foreground"
      {...props}
    />
  </div>
));

Calendar.displayName = "Calendar";

export { Calendar };
