import { Select } from "@canonical/react-components";

import { FetchGroupKey } from "app/store/machine/types";

type Props = {
  grouping: FetchGroupKey | null;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
};

const groupOptions = [
  {
    value: "",
    label: "No grouping",
  },
  {
    value: FetchGroupKey.Status,
    label: "Group by status",
  },
  {
    value: FetchGroupKey.Owner,
    label: "Group by owner",
  },
  {
    value: FetchGroupKey.Pool,
    label: "Group by resource pool",
  },
  {
    value: FetchGroupKey.Architecture,
    label: "Group by architecture",
  },
  {
    value: FetchGroupKey.Domain,
    label: "Group by domain",
  },
  {
    value: FetchGroupKey.Parent,
    label: "Group by parent",
  },
  {
    value: FetchGroupKey.Pod,
    label: "Group by KVM",
  },
  {
    value: FetchGroupKey.PodType,
    label: "Group by KVM type",
  },
  {
    value: FetchGroupKey.PowerState,
    label: "Group by power state",
  },
  {
    value: FetchGroupKey.Zone,
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
