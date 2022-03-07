import { Button } from "@canonical/react-components";

type Segment<V> = {
  title: string;
  value: V;
};

type Props<V> = {
  onSelect: (selected: V) => void;
  options: Segment<V>[];
  selected: V;
};

const SegmentToggle = <V,>({
  onSelect,
  options,
  selected,
  ...props
}: Props<V>): JSX.Element => {
  return (
    <div
      className="p-tab-buttons p-segment-toggle"
      role="radiogroup"
      {...props}
    >
      <div className="p-tab-buttons__list">
        {options.map((button) => (
          <Button
            aria-checked={button.value === selected}
            className="p-tab-buttons__button p-segment-toggle__button"
            key={button.title}
            onClick={() => onSelect(button.value)}
            role="radio"
          >
            {button.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SegmentToggle;
