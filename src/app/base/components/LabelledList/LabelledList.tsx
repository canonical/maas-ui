import type { ReactNode } from "react";

import { List } from "@canonical/react-components";
import classNames from "classnames";

type LabelledListItem = {
  label: ReactNode;
  value: ReactNode;
};

type Props = {
  className?: string;
  items: LabelledListItem[];
};

const LabelledList = ({ className, items, ...props }: Props): JSX.Element => {
  return (
    <List
      {...props}
      className={classNames("p-list--labelled", className)}
      items={items.map(({ label, value }) => (
        <>
          <div
            className="p-list__item-label"
            id={label ? label.toString().split(" ").join("") : "li-label"}
          >
            {label}
          </div>
          <div
            aria-labelledby={
              label ? label.toString().split(" ").join("") : "li-label"
            }
            className="p-list__item-value"
          >
            {value}
          </div>
        </>
      ))}
    />
  );
};

export default LabelledList;
