import { Select } from "@canonical/react-components";

import { FetchGroupByKey } from "app/store/machine/types/actions";

type Props = {
  grouping: FetchGroupByKey | null;
  setGrouping: (group: FetchGroupByKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
};

const groupOptions: Array<{ value: FetchGroupByKey | ""; label: string }> = [
  {
    value: "",
    label: "No grouping",
  },
  {
    value: FetchGroupByKey.Status,
    label: "Group by status",
  },
  {
    value: FetchGroupByKey.Owner,
    label: "Group by owner",
  },
  {
    value: FetchGroupByKey.Pool,
    label: "Group by resource pool",
  },
  {
    value: FetchGroupByKey.Architecture,
    label: "Group by architecture",
  },
  {
    value: FetchGroupByKey.Domain,
    label: "Group by domain",
  },
  {
    value: FetchGroupByKey.Parent,
    label: "Group by parent",
  },
  {
    value: FetchGroupByKey.Pod,
    label: "Group by KVM",
  },
  {
    value: FetchGroupByKey.PodType,
    label: "Group by KVM type",
  },
  {
    value: FetchGroupByKey.PowerState,
    label: "Group by power state",
  },
  {
    value: FetchGroupByKey.Zone,
    label: "Group by zone",
  },
];

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
        setGrouping((e.target.value as FetchGroupByKey) ?? null);
        setHiddenGroups([]);
      }}
      options={groupOptions}
    />
  );
};

export default GroupSelect;
