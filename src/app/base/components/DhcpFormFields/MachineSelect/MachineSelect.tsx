import { useEffect, useState } from "react";

import { Label, useId, useOnEscapePressed } from "@canonical/react-components";
import className from "classnames";
import { useDispatch } from "react-redux";

import SelectButton from "../../SelectButton";

import MachineSelectBox from "./MachineSelectBox/MachineSelectBox";

import OutsideClickHandler from "app/base/components/OutsideClickHandler";
import { usePreviousPersistent } from "app/base/hooks";
import type { Machine } from "app/store/machine/types";
import { useFetchMachine } from "app/store/machine/utils/hooks";
import { actions as tagActions } from "app/store/tag";

export enum Labels {
  AppliesTo = "Applies to",
  Loading = "Loading...",
  ChooseMachine = "Choose machine",
}

type Props = {
  label?: string;
  onSelect: (machine: Machine | null) => void;
  selected?: Machine["system_id"] | null;
};

export const MachineSelect = ({
  label = Labels.AppliesTo,
  onSelect,
  selected = null,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const selectId = useId();
  const handleSelect = (machine: Machine | null) => {
    setIsOpen(false);
    onSelect(machine);
  };
  const { machine } = useFetchMachine(selected);
  const previousMachine = usePreviousPersistent(machine);
  const selectedMachine = machine || previousMachine;
  useOnEscapePressed(() => setIsOpen(false));

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
              onSelect(null);
            }
          }}
        >
          {selectedMachine?.hostname || Labels.ChooseMachine}
        </SelectButton>
        <div
          className={className("machine-select-box-wrapper", {
            "machine-select-box-wrapper--is-open": isOpen,
          })}
        >
          {isOpen ? <MachineSelectBox onSelect={handleSelect} /> : null}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default MachineSelect;
