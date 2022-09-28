import type { ReactNode } from "react";

import type { InputProps, PropsWithSpread } from "@canonical/react-components";
import { Input } from "@canonical/react-components";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { SelectedMachines } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

export enum Checked {
  Checked = "true",
  Mixed = "mixed",
  Unchecked = "false",
}

type Props = PropsWithSpread<
  {
    callId?: string | null;
    extraClasses?: string;
    inputLabel?: ReactNode;
    isChecked: Checked;
    isDisabled?: boolean;
    onGenerateSelected: (checked: boolean) => SelectedMachines | null;
  },
  InputProps
>;

const TableCheckbox = ({
  callId,
  extraClasses,
  inputLabel,
  isChecked,
  isDisabled,
  onGenerateSelected,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machineCount = useSelector((state: RootState) =>
    machineSelectors.listCount(state, callId)
  );

  return (
    <Input
      aria-checked={isChecked}
      checked={isChecked !== Checked.Unchecked}
      disabled={machineCount === 0 || isDisabled}
      label={inputLabel}
      labelClassName="u-no-margin--bottom u-no-padding--top"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
          machineActions.setSelectedMachines(
            onGenerateSelected(event.target.checked)
          )
        );
      }}
      type="checkbox"
      wrapperClassName={classNames(
        "u-no-margin--bottom u-nudge--checkbox p-checkbox--non-disabled-label",
        extraClasses
      )}
      {...props}
    />
  );
};

export default TableCheckbox;
