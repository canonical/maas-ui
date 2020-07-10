import Field from "@canonical/react-components/dist/components/Field";
import React from "react";

const DEFAULT_FILLED_COLOR = "#0066CC";

type Props = {
  disabled?: boolean;
  emptyColor?: string;
  error?: string;
  filledColor?: string;
  help?: string;
  inputDisabled?: boolean;
  label?: string;
  max: number;
  min: number;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  required?: boolean;
  showInput?: boolean;
  step?: number;
  value: number;
};

export const Slider = ({
  disabled = false,
  emptyColor = "transparent",
  error,
  filledColor = DEFAULT_FILLED_COLOR,
  help,
  inputDisabled = false,
  label,
  max,
  min,
  onChange,
  required = false,
  showInput = false,
  step = 1,
  value,
}: Props): JSX.Element => {
  let style = {};
  if (navigator?.userAgent?.includes("AppleWebKit")) {
    // Range inputs on Webkit browsers don't have a built-in "filled" portion,
    // so instead it is handled here as a background.
    const filledPercentage = `${((value - min) / (max - min)) * 100}%`;
    style = {
      background: `linear-gradient(
        to right,
        ${filledColor} 0%,
        ${filledColor} ${filledPercentage},
        ${emptyColor} ${filledPercentage},
        ${emptyColor} 100%
      )`,
    };
  }
  return (
    <Field error={error} help={help} label={label}>
      <div className="p-slider__wrapper">
        <input
          className="p-slider"
          disabled={disabled}
          max={max}
          min={min}
          onChange={onChange}
          required={required}
          step={step}
          style={style}
          type="range"
          value={value}
        />
        {showInput && (
          <input
            className="p-slider__input"
            disabled={disabled || inputDisabled}
            max={max}
            min={min}
            onChange={onChange}
            step={step}
            type="number"
            value={value}
          />
        )}
      </div>
    </Field>
  );
};

export default Slider;
