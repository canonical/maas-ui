import { useRef } from "react";
import type { HTMLProps, ReactNode } from "react";

import { Input } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import classNames from "classnames";

import { someInArray, someNotAll } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

type Props<S> = {
  checkSelected?: CheckboxHandlers<S>["checkSelected"] | null;
  disabled?: boolean;
  handleGroupCheckbox: CheckboxHandlers<S>["handleGroupCheckbox"];
  inRow?: boolean;
  items: S[];
  // This needs to be something other than `label` to prevent conflicts with the
  // HTMLInputElement type.
  inputLabel?: ReactNode;
  selectedItems: S[];
} & HTMLProps<HTMLInputElement>;

const GroupCheckbox = <S,>({
  checkSelected,
  disabled,
  handleGroupCheckbox,
  inRow,
  items,
  inputLabel,
  selectedItems,
  ...props
}: Props<S>): JSX.Element => {
  const id = useRef(nanoid());
  return (
    <Input
      checked={
        checkSelected
          ? checkSelected(items, selectedItems)
          : someInArray(items, selectedItems)
      }
      className={classNames("has-inline-label", {
        "p-checkbox--mixed": someNotAll(items, selectedItems),
      })}
      disabled={items.length === 0 || disabled}
      id={id.current}
      label={inputLabel ? inputLabel : " "}
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
