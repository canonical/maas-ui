import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TagList from "../TagList";

import type { Machine } from "app/store/machine/types";
import { getTagCountsForMachines } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import tagsURLs from "app/tags/urls";

type Props = {
  machines: Machine[];
};

export enum Label {
  Automatic = "Automatic tags",
  Manual = "Manual tags",
  NoTags = "Tags for selected machines will appear here.",
}

export enum TestId {
  Border = "border",
}

export const TagFormChanges = ({ machines }: Props): JSX.Element => {
  const tagIdsAndCounts = getTagCountsForMachines(machines);
  const tagIds = Array.from(tagIdsAndCounts.keys());
  const automaticTags = useSelector((state: RootState) =>
    tagSelectors.getAutomaticByIDs(state, tagIds)
  );
  const manualTags = useSelector((state: RootState) =>
    tagSelectors.getManualByIDs(state, tagIds)
  );
  const machineCount = machines.length;
  const hasAutomaticTags = automaticTags.length > 0;
  const hasManualTags = manualTags.length > 0;
  if (!hasAutomaticTags && !hasManualTags) {
    return <p className="u-text--muted">{Label.NoTags}</p>;
  }
  return (
    <>
      <h5>Tag changes</h5>
      {hasManualTags ? (
        <TagList
          aria-label={Label.Manual}
          chipAppearance="information"
          // TODO: Implement removing tags from machines:
          // https://github.com/canonical-web-and-design/app-tribe/issues/691
          chipOnDismiss={() => null}
          description="Currently assigned:"
          machineCount={machineCount}
          tagIdsAndCounts={tagIdsAndCounts}
          tags={manualTags}
        />
      ) : null}
      {hasAutomaticTags && hasManualTags ? (
        <hr className="u-sv2" data-testid={TestId.Border} />
      ) : null}
      {hasAutomaticTags ? (
        <TagList
          aria-label={Label.Automatic}
          description={
            <>
              Automatic tags (cannot be unassigned. Go to the{" "}
              <Link to={tagsURLs.tags.index}>Tags tab</Link> to delete automatic
              tags):
            </>
          }
          machineCount={machineCount}
          tagIdsAndCounts={tagIdsAndCounts}
          tags={automaticTags}
        />
      ) : null}
    </>
  );
};

export default TagFormChanges;
