import { Select } from "@canonical/react-components";

import { groupOptions } from "app/machines/constants";
import type { FetchGroupKey } from "app/store/machine/types/actions";

type Props = {
  grouping: FetchGroupKey | null;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
};

const GroupSelect = ({
  grouping,
  setGrouping,
  setHiddenGroups,
}: Props): JSX.Element => {
  return (
    <Select
      aria-label="Group by"
      className="u-no-padding--right"
      defaultValue={grouping ?? ""}
      name="machine-groupings"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrouping((e.target.value as FetchGroupKey) ?? null);
        setHiddenGroups([]);
      }}
      options={groupOptions}
    />
  );
};

export default GroupSelect;
