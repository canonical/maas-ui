import DoubleRow from "@/app/base/components/DoubleRow";
import { getRanges } from "@/app/utils";

type Props = {
  readonly pinnedCores: number[];
  readonly unpinnedCores: number;
};

const CoresColumn = ({
  pinnedCores,
  unpinnedCores,
}: Props): React.ReactElement => {
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
