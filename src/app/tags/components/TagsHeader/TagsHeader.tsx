import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import SearchBox from "app/base/components/SearchBox";
import SegmentedControl from "app/base/components/SegmentedControl";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import { TagSearchFilter } from "app/store/tag/selectors";
import { TagSidePanelViews } from "app/tags/constants";
import { TagViewState } from "app/tags/types";

export type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filter: TagSearchFilter;
  setFilter: (filter: TagSearchFilter) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  isDetails: boolean;
  setSidePanelContent: SetSidePanelContent;
  tagViewState?: TagViewState | null;
  tagCount: number;
  tableId: string;
};

export enum Label {
  CreateButton = "Create new tag",
  Header = "Tags header",
  All = "All tags",
  Manual = "Manual tags",
  Auto = "Automatic tags",
}

export const TagsHeader = ({
  searchText,
  setSearchText,
  filter,
  setFilter,
  isDetails,
  setSidePanelContent,
  tagViewState,
}: Props): JSX.Element => {
  return (
    <MainToolbar>
      <MainToolbar.Title>Tags</MainToolbar.Title>
      <MainToolbar.Controls>
        {tagViewState === TagViewState.Updating ? null : (
          <>
            {isDetails ? null : (
              <>
                <SearchBox
                  className="u-no-margin--bottom"
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
          </>
        )}
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default TagsHeader;
