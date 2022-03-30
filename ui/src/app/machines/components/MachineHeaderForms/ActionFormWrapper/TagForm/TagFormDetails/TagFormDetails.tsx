import type { Tag, TagMeta } from "app/store/tag/types";
import TagDetails from "app/tags/components/TagDetails";
import { isId } from "app/utils";

type Props = {
  tagId: Tag[TagMeta.PK] | null;
};

export enum Label {
  SelectTag = "Select a tag to view information about it.",
}

export enum TestId {
  Border = "border",
}

export const TagFormChanges = ({ tagId }: Props): JSX.Element => {
  if (!isId(tagId)) {
    return <p className="u-text--muted">{Label.SelectTag}</p>;
  }
  return <TagDetails id={tagId} narrow />;
};

export default TagFormChanges;
