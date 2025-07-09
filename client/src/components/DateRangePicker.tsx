import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  align?: "start" | "center" | "end";
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  align = "start",
  className,
}: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handlePresetChange = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "last7days":
        onDateRangeChange({
          from: addDays(today, -7),
          to: today,
        });
        break;
      case "last30days":
        onDateRangeChange({
          from: addDays(today, -30),
          to: today,
        });
        break;
      case "last90days":
        onDateRangeChange({
          from: addDays(today, -90),
          to: today,
        });
        break;
      case "thismonth": {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        onDateRangeChange({
          from: start,
          to: today,
        });
        break;
      }
      case "lastmonth": {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        onDateRangeChange({
          from: start,
          to: end,
        });
        break;
      }
      case "thisyear": {
        const start = new Date(today.getFullYear(), 0, 1);
        onDateRangeChange({
          from: start,
          to: today,
        });
        break;
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} -{" "}
                  {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex flex-col sm:flex-row gap-2 p-3 border-b">
            <Select
              onValueChange={handlePresetChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="thismonth">This month</SelectItem>
                <SelectItem value="lastmonth">Last month</SelectItem>
                <SelectItem value="thisyear">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}