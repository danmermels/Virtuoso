import * as React from "react";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function RadioGroup({ value, defaultValue, onValueChange, children, ...props }: RadioGroupProps) {
  const [selected, setSelected] = React.useState(defaultValue || "");

  React.useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleChange = (val: string) => {
    setSelected(val);
    onValueChange?.(val);
  };

  return (
    <div {...props} role="radiogroup">
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              checked: child.props.value === selected,
              onChange: () => handleChange(child.props.value),
            })
          : child
      )}
    </div>
  );
}

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function RadioGroupItem({ label, ...props }: RadioGroupItemProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        className="form-radio text-blue-600 focus:ring-blue-500"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
