import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type FieldError as RHFFieldError,
} from "react-hook-form";
import { cn } from "@/lib/utils";

const fieldVariants = cva("flex w-full data-[invalid=true]:**:data-[slot=field-label]:text-destructive", {
  variants: {
    orientation: {
      vertical: "flex-col gap-2",
      horizontal: "flex-row items-start gap-4",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export type FieldProps = ComponentProps<"div"> &
  VariantProps<typeof fieldVariants> & {
    "data-invalid"?: boolean;
  };

export function Field({
  className,
  orientation,
  "data-invalid": dataInvalid,
  ...props
}: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-invalid={dataInvalid}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

export function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    />
  );
}

export function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex w-full min-w-0 flex-col gap-4 border-0 p-0", className)}
      {...props}
    />
  );
}

export function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "font-display font-semibold text-card-foreground",
        variant === "label" ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    />
  );
}

export function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-2", className)}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-sm font-medium text-card-foreground", className)}
      {...props}
    />
  );
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type FieldErrorProps = ComponentProps<"div"> & {
  errors?: Array<RHFFieldError | undefined>;
};

export function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const content =
    children ??
    errors
      ?.filter((error) => error?.message)
      .map((error) => error?.message)
      .join("\n");

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export function FieldSeparator({
  className,
  children,
  ...props
}: ComponentProps<"div"> & { children?: ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative my-2 flex items-center", className)}
      {...props}
    >
      <div className="h-px w-full bg-border" aria-hidden />
      {children ? (
        <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  );
}

type ControlledFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  rules?: RegisterOptions<TFieldValues, TName>;
  id?: string;
  orientation?: FieldProps["orientation"];
  className?: string;
  children: (render: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    id: string;
    controlProps: ControllerRenderProps<TFieldValues, TName> & {
      id: string;
      "aria-invalid": boolean;
    };
    triggerProps: {
      id: string;
      "aria-invalid": boolean;
    };
  }) => ReactNode;
};

/** Wraps react-hook-form Controller + Field layout for reuse across forms. */
export function ControlledField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  rules,
  id: idProp,
  orientation,
  className,
  children,
}: ControlledFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const fieldId = idProp ?? `${generatedId}-${String(name)}`;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          orientation={orientation}
          className={className}
        >
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
          <FieldContent>
            {children({
              field,
              fieldState,
              id: fieldId,
              controlProps: {
                ...field,
                id: fieldId,
                "aria-invalid": fieldState.invalid,
              },
              triggerProps: {
                id: fieldId,
                "aria-invalid": fieldState.invalid,
              },
            })}
            {description ? <FieldDescription>{description}</FieldDescription> : null}
            {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
          </FieldContent>
        </Field>
      )}
    />
  );
}
