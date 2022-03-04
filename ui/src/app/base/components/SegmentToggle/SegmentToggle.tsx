import { Button } from "@canonical/react-components";
import classNames from "classnames";

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
}: Props<V>): JSX.Element => {
  return (
    <div className="p-segment-toggle">
      {options.map(({ title, value }) => (
        <Button
          className={classNames("p-segment-toggle__button", {
            "is-active": value === selected,
          })}
          key={title}
          onClick={() => onSelect(value)}
        >
          {title}
        </Button>
      ))}
    </div>
  );
};

export default SegmentToggle;
