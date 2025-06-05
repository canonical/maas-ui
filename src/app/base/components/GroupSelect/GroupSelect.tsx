import { Select } from "@canonical/react-components";
import classNames from "classnames";

type Props<T> = {
  readonly className?: string;
  readonly grouping: T | null;
  readonly groupOptions: { value: T | string; label: string }[];
  readonly name?: string;
  readonly setGrouping: (group: T | null) => void;
  readonly setHiddenGroups?: (groups: string[]) => void;
};

const GroupSelect = <T extends string>({
  grouping,
  setGrouping,
  setHiddenGroups,
  groupOptions,
  name,
  className,
}: Props<T>): React.ReactElement => {
  return (
    <Select
      aria-label="Group by"
      className={classNames("u-no-padding--right", className)}
      defaultValue={grouping ?? ""}
      name={name || "machine-groupings"}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrouping((e.target.value as T) ?? null);
        setHiddenGroups && setHiddenGroups([]);
      }}
      options={groupOptions}
    />
  );
};

export default GroupSelect;
