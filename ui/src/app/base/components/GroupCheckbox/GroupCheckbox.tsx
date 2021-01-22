import { useRef } from "react";
import type { HTMLProps, ReactNode } from "react";

import { Input } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import classNames from "classnames";

import { someInArray, someNotAll } from "app/utils";

type Props<R, S> = {
  handleGroupCheckbox: (rows: R[], selected: S[]) => void;
  items: R[];
  label?: ReactNode;
  selectedItems: S[];
} & HTMLProps<HTMLInputElement>;

const GroupCheckbox = <R, S>({
  handleGroupCheckbox,
  items,
  label,
  selectedItems,
  ...props
}: Props<R, S>): JSX.Element => {
  const id = useRef(nanoid());
  return (
    <Input
      checked={someInArray(items, selectedItems)}
      className={classNames("has-inline-label", {
        "p-checkbox--mixed": someNotAll(items, selectedItems),
      })}
      disabled={items.length === 0}
      id={id.current}
      label={label ? label : " "}
      onChange={() => handleGroupCheckbox(items, selectedItems)}
      type="checkbox"
      wrapperClassName="u-no-margin--bottom u-align-header-checkbox u-nudge--checkbox"
      {...props}
    />
  );
};

export default GroupCheckbox;
