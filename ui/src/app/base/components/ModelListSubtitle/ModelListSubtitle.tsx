import { Button } from "@canonical/react-components";
import pluralize from "pluralize";

type Props = {
  available: number;
  filterSelected?: () => void;
  modelName: string;
  selected?: number;
};

const getSubtitleString = (
  available: number,
  modelName: string,
  selected: number
) => {
  if (available === 0) {
    return `No ${modelName}s available`;
  } else if (selected === available) {
    return `All ${modelName}s selected`;
  } else {
    const nodeCountString = pluralize(modelName, available, true);

    if (selected) {
      return `${selected} of ${nodeCountString} selected`;
    } else {
      return `${nodeCountString} available`;
    }
  }
};

export const ModelListSubtitle = ({
  available,
  filterSelected,
  modelName,
  selected = 0,
}: Props): JSX.Element => {
  const subtitleString = getSubtitleString(available, modelName, selected);
  const showFilterButton = selected && selected !== available && filterSelected;

  if (showFilterButton) {
    return (
      <Button
        appearance="link"
        data-test="filter-selected"
        onClick={filterSelected}
      >
        {subtitleString}
      </Button>
    );
  }
  return (
    <span className="u-text--muted" data-test="subtitle-string">
      {subtitleString}
    </span>
  );
};

export default ModelListSubtitle;
