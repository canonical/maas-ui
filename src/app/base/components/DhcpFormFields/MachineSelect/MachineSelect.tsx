import type { HTMLProps } from "react";
import { useEffect, useState } from "react";

import { Label, useId, useOnEscapePressed } from "@canonical/react-components";
import className from "classnames";
import { useFormikContext } from "formik";
import { useDispatch } from "react-redux";

import SelectButton from "../../SelectButton";

import MachineSelectBox from "./MachineSelectBox/MachineSelectBox";

import OutsideClickHandler from "app/base/components/OutsideClickHandler";
import { usePreviousPersistent } from "app/base/hooks";
import type { FetchFilters, Machine } from "app/store/machine/types";
import { useFetchMachine } from "app/store/machine/utils/hooks";
import { actions as tagActions } from "app/store/tag";

export enum Labels {
  AppliesTo = "Applies to",
  Loading = "Loading...",
  ChooseMachine = "Choose machine",
}

export type Props = {
  label?: React.ReactNode;
  defaultOption?: string;
  filters?: FetchFilters;
  displayError?: boolean;
  name: string;
  value?: HTMLProps<HTMLElement>["value"];
};

export const MachineSelect = ({
  name,
  filters,
  label = Labels.AppliesTo,
  defaultOption = Labels.ChooseMachine,
  value,
}: Props): JSX.Element => {
  const { setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const selectId = useId();
  const handleSelect = (machine: Machine | null) => {
    setIsOpen(false);
    setFieldValue(name, machine?.system_id || null);
  };
  useOnEscapePressed(() => setIsOpen(false));
  const { machine } = useFetchMachine(value as string);
  const previousMachine = usePreviousPersistent(machine);
  const selectedMachine = machine || previousMachine;

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <div className="machine-select">
      <Label id={selectId}>{label}</Label>
      <OutsideClickHandler onClick={() => setIsOpen(false)}>
        <SelectButton
          aria-describedby={selectId}
          aria-haspopup="listbox"
          className="u-no-margin--bottom"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setFieldValue(name, "", false);
            }
          }}
        >
          {selectedMachine?.hostname || defaultOption}
        </SelectButton>
        <div
          className={className("machine-select-box-wrapper", {
            "machine-select-box-wrapper--is-open": isOpen,
          })}
        >
          {isOpen ? (
            <MachineSelectBox filters={filters} onSelect={handleSelect} />
          ) : null}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default MachineSelect;
