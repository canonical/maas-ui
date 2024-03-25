import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SearchBox from "@/app/base/components/SearchBox";
import SegmentedControl from "@/app/base/components/SegmentedControl";
import { useGetURLId } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import tagSelectors, { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag } from "@/app/store/tag/types";
import { TagMeta } from "@/app/store/tag/types";
import { TagSidePanelViews } from "@/app/tags/constants";

export type Props = {
  filter: TagSearchFilter;
  setFilter: (filter: TagSearchFilter) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  isDetails: boolean;
  setSidePanelContent: SetSidePanelContent;
  onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
  onUpdate: (id: Tag[TagMeta.PK]) => void;
};

export enum Label {
  CreateButton = "Create new tag",
  EditButton = "Edit",
  DeleteButton = "Delete",
  Header = "Tags header",
  All = "All tags",
  Manual = "Manual tags",
  Auto = "Automatic tags",
}

export const TagsHeader = ({
  filter,
  setFilter,
  searchText,
  setSearchText,
  isDetails,
  setSidePanelContent,
  onDelete,
  onUpdate,
}: Props): JSX.Element => {
  const id = useGetURLId(TagMeta.PK);
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );

  return (
    <MainToolbar>
      <MainToolbar.Title>Tags</MainToolbar.Title>
      {isDetails ? (
        <Link className="u-sv3" to={urls.tags.index}>
          &lsaquo; Back to all tags
        </Link>
      ) : null}
      <MainToolbar.Controls>
        {isDetails && tag ? (
          <>
            <Button hasIcon onClick={() => onUpdate(tag[TagMeta.PK])}>
              <Icon name="edit" /> <span>{Label.EditButton}</span>
            </Button>
            <Button
              appearance="negative"
              hasIcon
              onClick={() => onDelete(tag[TagMeta.PK], true)}
            >
              <Icon className="is-light" name="delete" />{" "}
              <span>{Label.DeleteButton}</span>
            </Button>
          </>
        ) : (
          <>
            <SearchBox
              externallyControlled
              onChange={setSearchText}
              value={searchText}
            />
            <SegmentedControl
              aria-label="tag filter"
              onSelect={setFilter}
              options={[
                {
                  label: Label.All,
                  value: TagSearchFilter.All,
                },
                {
                  label: Label.Manual,
                  value: TagSearchFilter.Manual,
                },
                {
                  label: Label.Auto,
                  value: TagSearchFilter.Auto,
                },
              ]}
              selected={filter}
            />
          </>
        )}
        <Button
          appearance="positive"
          onClick={() =>
            setSidePanelContent({ view: TagSidePanelViews.AddTag })
          }
        >
          {Label.CreateButton}
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default TagsHeader;
