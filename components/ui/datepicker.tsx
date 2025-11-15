"use client";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  // Parse date string tanpa timezone conversion
  const date = value ? new Date(value + "T00:00:00") : undefined;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          className="w-[355px] lg:w-[230px] p-2"
          selected={date}
          captionLayout="dropdown"
          onSelect={newDate => {
            if (newDate) {
              // Format date sebagai YYYY-MM-DD tanpa timezone conversion
              const year = newDate.getFullYear();
              const month = String(newDate.getMonth() + 1).padStart(2, "0");
              const day = String(newDate.getDate()).padStart(2, "0");
              onChange(`${year}-${month}-${day}`);
            }
          }}
          disabled={date => date > new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
