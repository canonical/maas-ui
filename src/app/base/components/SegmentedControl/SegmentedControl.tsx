import type { HTMLAttributes } from "react";

import classNames from "classnames";

type Segment<V> = {
  title: string;
  value: V;
};

type Props<V> = {
  onSelect: (selected: V) => void;
  options: Segment<V>[];
  selected: V;
} & Omit<HTMLAttributes<HTMLDivElement>, "onSelect">;

const SegmentedControl = <V,>({
  className,
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
            className="p-segmented-control__button"
            key={button.title}
            onClick={() => onSelect(button.value)}
            role="tab"
            type="button"
          >
            {button.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
