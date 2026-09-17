"use client";

import type { ChangeEvent, ComponentProps, MouseEvent } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { Input } from "@/components/site/shared/ui/input/input";
import { cn } from "@/lib/utils";

const hideNativePickerClass =
  "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";

function openNativePicker(event: MouseEvent<HTMLButtonElement>) {
  const input = event.currentTarget.parentElement?.querySelector("input");
  if (!(input instanceof HTMLInputElement) || input.disabled) return;

  try {
    input.showPicker();
  } catch {
    input.focus();
  }
}

type AdminDateInputProps = ComponentProps<typeof Input>;

export function AdminDateInput({
  className,
  disabled,
  ...props
}: AdminDateInputProps) {
  return (
    <div className="relative">
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={openNativePicker}
        aria-label="Chọn ngày"
        className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-card-foreground disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer"
      >
        <Calendar className="size-4" aria-hidden />
      </button>
      <Input
        type="date"
        disabled={disabled}
        className={cn(
          "pl-10 tabular-nums tracking-tight",
          hideNativePickerClass,
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
  disabled,
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
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={openNativePicker}
        aria-label="Chọn giờ"
        className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-card-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <Clock className="size-4" aria-hidden />
      </button>
      <Input
        type="time"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "pl-10 tabular-nums tracking-tight",
          hasValue && "pr-10",
          hideNativePickerClass,
          className,
        )}
        {...props}
      />
      {hasValue ? (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          aria-label="Xóa giờ"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-card-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
