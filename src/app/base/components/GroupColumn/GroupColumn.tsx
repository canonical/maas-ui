import pluralize from "pluralize";

import DoubleRow from "app/base/components/DoubleRow";

export enum Label {
  HideGroup = "Hide",
  ShowGroup = "Show",
}

type GroupColumnProps = {
  itemName: string;
  groupName: string;
  count: number;
};

const GroupColumn = ({ itemName, groupName, count }: GroupColumnProps) => {
  return (
    <>
      <DoubleRow
        primary={<strong>{groupName}</strong>}
        secondary={<span>{pluralize(itemName, count, true)}</span>}
      />
    </>
  );
};

export default GroupColumn;
