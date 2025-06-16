import * as React from "react";
import { useFormContext, FormProvider, type UseFormReturn, Controller } from "react-hook-form";
import type { ControllerRenderProps, ControllerFieldState, UseFormStateReturn, FieldValues } from "react-hook-form";

export function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form {...props} className={[props.className].filter(Boolean).join(" ")}>{children}</form>
  );
}

export function FormField({ name, render }: { name: string; render: (params: { field: ControllerRenderProps<FieldValues, string>, fieldState: ControllerFieldState, formState: UseFormStateReturn<FieldValues> }) => React.ReactElement }) {
  const { control } = useFormContext();
  return <Controller name={name} control={control} render={render} />;
}

export function FormItem({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={["space-y-2", props.className].filter(Boolean).join(" ")}>{children}</div>;
}

export function FormLabel({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={["block text-sm font-medium text-gray-700", props.className].filter(Boolean).join(" ")}>{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-500">{children}</p>;
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  return children ? <p className="text-xs text-red-500">{children}</p> : null;
}
