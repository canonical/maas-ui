import { useRef } from "react";
import type { HTMLProps, ReactNode } from "react";

import { Input } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";

import { someInArray } from "app/utils";

type Props<I> = {
  handleRowCheckbox: (item: I, rows: I[]) => void;
  checkSelected?: ((item: I, rows: I[]) => boolean) | null;
  items: I[];
  // This needs to be something other than `label` to prevent conflicts with the
  // HTMLInputElement type.
  inputLabel?: ReactNode;
  item: I;
} & HTMLProps<HTMLInputElement>;

const RowCheckbox = <I,>({
  handleRowCheckbox,
  checkSelected,
  item,
  items,
  inputLabel,
  ...props
}: Props<I>): JSX.Element => {
  const id = useRef(nanoid());
  return (
    <Input
      checked={
        checkSelected ? checkSelected(item, items) : someInArray(item, items)
      }
      className="has-inline-label keep-label-opacity"
      id={id.current}
      onChange={() => handleRowCheckbox(item, items)}
      type="checkbox"
      label={inputLabel}
      wrapperClassName="u-no-margin--bottom u-nudge--checkbox"
      {...props}
    />
  );
};

export default RowCheckbox;
