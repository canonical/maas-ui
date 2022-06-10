import { Select } from "@canonical/react-components";

type Props = {
  grouping: string;
  setGrouping: (group: string) => void;
  setHiddenGroups: (groups: string[]) => void;
};

const groupOptions = [
  {
    value: "none",
    label: "No grouping",
  },
  {
    value: "owner",
    label: "Group by owner",
  },
  {
    value: "pool",
    label: "Group by pool",
  },
  {
    value: "power_state",
    label: "Group by power state",
  },
  {
    value: "status",
    label: "Group by status",
  },
  {
    value: "zone",
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
      defaultValue={grouping}
      name="machine-groupings"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrouping(e.target.value);
        setHiddenGroups([]);
      }}
      options={groupOptions}
    />
  );
};

export default GroupSelect;
