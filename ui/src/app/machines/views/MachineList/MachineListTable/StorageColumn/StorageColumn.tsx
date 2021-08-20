import { memo } from "react";

import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = {
  systemId: Machine[MachineMeta.PK];
};

export const StorageColumn = ({ systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return null;
  }
  const formattedStorage = formatBytes(machine.storage, "GB");

  return (
    <DoubleRow
      primary={
        <>
          <span data-test="storage-value">{formattedStorage.value}</span>&nbsp;
          <small className="u-text--light" data-test="storage-unit">
            {formattedStorage.unit}
          </small>
        </>
      }
      primaryClassName="u-align--right"
    />
  );
};

export default memo(StorageColumn);
