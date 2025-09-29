import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import SearchBox from "@/app/base/components/SearchBox";
import SegmentedControl from "@/app/base/components/SegmentedControl";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import { TagSidePanelViews } from "@/app/tags/constants";

export type Props = {
  filter: TagSearchFilter;
  setFilter: (filter: TagSearchFilter) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  setSidePanelContent: SetSidePanelContent;
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

export const TagsListHeader = ({
  filter,
  setFilter,
  searchText,
  setSearchText,
  setSidePanelContent,
}: Props): React.ReactElement => {
  return (
    <MainToolbar>
      <MainToolbar.Title>Tags</MainToolbar.Title>
      <MainToolbar.Controls>
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
        <Button
          appearance="positive"
          onClick={() => {
            setSidePanelContent({ view: TagSidePanelViews.AddTag });
          }}
        >
          {Label.CreateButton}
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default TagsListHeader;
