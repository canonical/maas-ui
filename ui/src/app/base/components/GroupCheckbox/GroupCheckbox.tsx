import { useRef } from "react";
import type { HTMLProps, ReactNode } from "react";

import { Input } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import classNames from "classnames";

import { someInArray, someNotAll } from "app/utils";

type Props<R, S> = {
  disabled?: boolean;
  handleGroupCheckbox: (rows: R[], selected: S[]) => void;
  inRow?: boolean;
  items: R[];
  label?: ReactNode;
  selectedItems: S[];
} & HTMLProps<HTMLInputElement>;

const GroupCheckbox = <R, S>({
  disabled,
  handleGroupCheckbox,
  inRow,
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
      disabled={items.length === 0 || disabled}
      id={id.current}
      label={label ? label : " "}
      onChange={() => handleGroupCheckbox(items, selectedItems)}
      type="checkbox"
      wrapperClassName={classNames("u-no-margin--bottom u-nudge--checkbox", {
        "u-align-header-checkbox": !inRow,
      })}
      {...props}
    />
  );
};

export default GroupCheckbox;
