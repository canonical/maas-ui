import { memo, useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import { useMachineActions } from "app/base/hooks";
import { useToggleMenu } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import { getTagsDisplay } from "app/store/tag/utils";
import { NodeActions } from "app/store/types/node";

type Props = {
  onToggleMenu?: (systemId: Machine[MachineMeta.PK], open: boolean) => void;
  systemId: Machine[MachineMeta.PK];
};

export const OwnerColumn = ({ onToggleMenu, systemId }: Props): JSX.Element => {
  const [updating, setUpdating] = useState<Machine["status"] | null>(null);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const machineTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, machine?.tags || null)
  );
  const toggleMenu = useToggleMenu(onToggleMenu || null, systemId);
  const ownerDisplay = machine?.owner || "-";
  const tagsDisplay = getTagsDisplay(machineTags);

  const menuLinks = useMachineActions(
    systemId,
    [NodeActions.ACQUIRE, NodeActions.RELEASE],
    "No owner actions available",
    () => {
      if (machine) {
        setUpdating(machine.status);
      }
    }
  );

  useEffect(() => {
    if (updating !== null && machine?.status !== updating) {
      setUpdating(null);
    }
  }, [updating, machine?.status]);

  return (
    <DoubleRow
      menuLinks={onToggleMenu ? menuLinks : null}
      menuTitle="Take action:"
      onToggleMenu={toggleMenu}
      primary={
        <>
          {updating === null ? null : (
            <Spinner className="u-nudge-left--small" />
          )}
          <span data-testid="owner">{ownerDisplay}</span>
        </>
      }
      primaryTitle={ownerDisplay}
      secondary={
        <span title={tagsDisplay} data-testid="tags">
          {tagsDisplay}
        </span>
      }
      secondaryTitle={tagsDisplay}
    />
  );
};

export default memo(OwnerColumn);
