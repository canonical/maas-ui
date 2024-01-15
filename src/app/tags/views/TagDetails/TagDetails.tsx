import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { actions as tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";
import { TagMeta } from "@/app/store/tag/types";
import BaseTagDetails from "@/app/tags/components/TagDetails";
import { isId } from "@/app/utils";

export enum Label {
  Title = "Tag details",
  AppliedTo = "Applied to",
  Comment = "Comment",
  Definition = "Definition (automatic tag)",
  DeleteButton = "Delete",
  EditButton = "Edit",
  Name = "Tag name",
  Options = "Kernel options",
  Update = "Last update",
}

const TagDetails = (): JSX.Element => {
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const tagsLoading = useSelector(tagSelectors.loading);

  useWindowTitle(tag ? `Tag: ${tag.name}` : "Tag");

  useFetchActions([tagActions.fetch]);

  if (!isId(id) || (!tagsLoading && !tag)) {
    return <ModelNotFound id={id} linkURL={urls.tags.index} modelName="tag" />;
  }

  if (!tag || tagsLoading) {
    return (
      <span data-testid="Spinner">
        <Spinner />
      </span>
    );
  }

  return (
    <div aria-label={Label.Title}>
      <BaseTagDetails id={id} />
    </div>
  );
};

export default TagDetails;
