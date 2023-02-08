import type { HTMLAttributes } from "react";

import classNames from "classnames";

type Segment<V> = {
  label: string;
  value: V;
};

type Props<V> = {
  onSelect: (selected: V) => void;
  buttonClassName?: string;
  options: Segment<V>[];
  selected: V;
} & Omit<HTMLAttributes<HTMLDivElement>, "onSelect">;

const SegmentedControl = <V,>({
  className,
  buttonClassName,
  onSelect,
  options,
  selected,
  ...props
}: Props<V>): JSX.Element => {
  return (
    <div className={classNames("p-segmented-control", className)} {...props}>
      <div className="p-segmented-control__list" role="tablist">
        {options.map((button) => (
          <button
            aria-selected={button.value === selected}
            className={classNames(
              "p-segmented-control__button",
              buttonClassName
            )}
            key={button.label}
            onClick={() => onSelect(button.value)}
            role="tab"
            type="button"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
