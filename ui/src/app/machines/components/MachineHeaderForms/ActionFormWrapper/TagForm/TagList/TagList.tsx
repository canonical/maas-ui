import type { ReactNode } from "react";

import type { ChipProps } from "@canonical/react-components";
import { Chip } from "@canonical/react-components";

import type { TagIdCountMap } from "app/store/machine/utils";
import type { Tag } from "app/store/tag/types";

type Props = {
  chipAppearance?: ChipProps["appearance"];
  chipOnDismiss?: ChipProps["onDismiss"];
  chipOnClick?: ChipProps["onClick"];
  description: ReactNode;
  machineCount: number;
  tags: Tag[];
  tagIdsAndCounts: TagIdCountMap;
};

export const TagList = ({
  chipAppearance,
  chipOnDismiss,
  chipOnClick,
  description,
  machineCount,
  tags,
  tagIdsAndCounts,
  ...props
}: Props): JSX.Element => {
  return (
    <div {...props}>
      <p className="u-no-margin--bottom">{description}</p>
      {tags.map((tag) => {
        const tagCount = tagIdsAndCounts.get(tag.id);
        return (
          <Chip
            appearance={chipAppearance}
            key={tag.id}
            onDismiss={chipOnDismiss}
            onClick={chipOnClick}
            value={`${tag.name} (${tagCount}/${machineCount})`}
          />
        );
      })}
    </div>
  );
};

export default TagList;
