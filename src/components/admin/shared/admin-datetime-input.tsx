import type { ChangeEvent, ComponentProps } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { Input } from "@/components/site/shared/ui/input/input";
import { cn } from "@/lib/utils";

const pickerIndicatorClass =
  "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

type AdminDateInputProps = ComponentProps<typeof Input>;

export function AdminDateInput({ className, ...props }: AdminDateInputProps) {
  return (
    <div className="relative">
      <Calendar
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="date"
        className={cn(
          "pl-10 tabular-nums tracking-tight",
          pickerIndicatorClass,
          className,
        )}
        {...props}
      />
    </div>
  );
}

type AdminTimeInputProps = ComponentProps<typeof Input>;

export function AdminTimeInput({
  className,
  value,
  onChange,
  ...props
}: AdminTimeInputProps) {
  const stringValue = value == null ? "" : String(value);
  const hasValue = stringValue.trim() !== "";

  function handleClear() {
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as ChangeEvent<HTMLInputElement>);
  }

  return (
    <div className="relative">
      <Clock
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="time"
        value={value}
        onChange={onChange}
        className={cn(
          "pl-10 tabular-nums tracking-tight",
          hasValue && "pr-10",
          pickerIndicatorClass,
          className,
        )}
        {...props}
      />
      {hasValue ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Xóa giờ"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
