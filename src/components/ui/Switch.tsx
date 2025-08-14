import * as React from "react"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      // Still call the original onChange if provided
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 peer-checked:bg-blue-600">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform peer-checked:translate-x-6 peer-checked:bg-white" />
        </div>
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium text-gray-900 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
