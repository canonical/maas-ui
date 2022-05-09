import { Select } from "@canonical/react-components";

type Props = {
  grouping: string;
  setGrouping: (group: string) => void;
  setHiddenGroups: (groups: string[]) => void;
};

const groupOptions = [
  {
    label: "No grouping",
    value: "none",
  },
  {
    label: "Group by owner",
    value: "owner",
  },
  {
    label: "Group by pool",
    value: "pool",
  },
  {
    label: "Group by power state",
    value: "power_state",
  },
  {
    label: "Group by status",
    value: "status",
  },
  {
    label: "Group by zone",
    value: "zone",
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
