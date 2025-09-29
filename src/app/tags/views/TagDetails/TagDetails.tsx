import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TagForms from "../../components/TagForms";
import TagsDetailsHeader from "../../components/TagsDetailsHeader";
import { TagSidePanelViews } from "../../constants";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useGetURLId } from "@/app/base/hooks/urls";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";
import type { Tag } from "@/app/store/tag/types";
import { TagMeta } from "@/app/store/tag/types";
import TagSummary from "@/app/tags/components/TagSummary";
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

const TagDetails = (): React.ReactElement => {
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const tagsLoading = useSelector(tagSelectors.loading);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const onDelete = (id: Tag[TagMeta.PK], fromDetails?: boolean) => {
    setSidePanelContent({
      view: TagSidePanelViews.DeleteTag,
      extras: { fromDetails, id },
    });
  };
  const onUpdate = (id: Tag[TagMeta.PK]) => {
    setSidePanelContent({
      view: TagSidePanelViews.UpdateTag,
      extras: {
        id,
      },
    });
  };
  useWindowTitle(tag ? `Tag: ${tag.name}` : "Tag");

  useFetchActions([tagActions.fetch]);

  return (
    <PageContent
      header={
        <TagsDetailsHeader
          onDelete={onDelete}
          onUpdate={onUpdate}
          setSidePanelContent={setSidePanelContent}
        />
      }
      sidePanelContent={
        sidePanelContent && (
          <TagForms
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getSidePanelTitle("Tags", sidePanelContent)}
    >
      {!isId(id) || (!tagsLoading && !tag) ? (
        <ModelNotFound id={id} linkURL={urls.tags.index} modelName="tag" />
      ) : !tag || tagsLoading ? (
        <span data-testid="Spinner">
          <Spinner />
        </span>
      ) : (
        <div aria-label={Label.Title}>
          <TagSummary id={id} />
        </div>
      )}
    </PageContent>
  );
};

export default TagDetails;
