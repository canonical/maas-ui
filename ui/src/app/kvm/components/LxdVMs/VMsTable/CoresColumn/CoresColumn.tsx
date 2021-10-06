import DoubleRow from "app/base/components/DoubleRow";
import { getRanges } from "app/utils";

type Props = {
  pinnedCores: number[];
  unpinnedCores: number;
};

const CoresColumn = ({ pinnedCores, unpinnedCores }: Props): JSX.Element => {
  const pinnedRanges = getRanges(pinnedCores).join(", ");
  const primaryText = pinnedRanges || `Any ${unpinnedCores}`;
  const secondaryText = pinnedRanges && "pinned";
  return (
    <DoubleRow
      primary={primaryText}
      primaryClassName="u-align--right"
      primaryTitle={primaryText}
      secondary={secondaryText}
      secondaryClassName="u-align--right"
      secondaryTitle={secondaryText}
    />
  );
};

export default CoresColumn;
