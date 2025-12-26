"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Range } from "react-day-picker";

function formatDisplayDate(date?: Date) {
  if (!date) return "-";
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type DateRangeValue = {
  from?: Date;
  to?: Date;
};

type DateRangePickerProps = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  disabled?: boolean;
  maxDate?: Date;
  className?: string;
};

function DateRangePicker({
  value,
  onChange,
  disabled = false,
  maxDate,
  className,
}: DateRangePickerProps) {
  const handleSelect = (selectedRange: Range | undefined) => {
    onChange({
      from: selectedRange?.from ?? undefined,
      to: selectedRange?.to ?? undefined,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          aria-label="Seleccionar rango de fechas"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Desde
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatDisplayDate(value.from)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Hasta
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatDisplayDate(value.to)}
            </span>
          </div>
          <CalendarIcon className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" sideOffset={8} align="start">
        <Calendar
          mode="range"
          selected={value as Range}
          onSelect={handleSelect}
          className="w-[18rem]"
          showOutsideDays
          disabled={maxDate ? { after: maxDate } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker, type DateRangeValue };
