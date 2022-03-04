import { useSelector } from "react-redux";

import { TAGS_PER_PAGE } from "../constants";

import ActionBar from "app/base/components/ActionBar";
import SegmentToggle from "app/base/components/SegmentToggle";
import type { SetSearchFilter } from "app/base/types";
import tagSelectors, { TagSearchFilter } from "app/store/tag/selectors";

type Props = {
  filter: TagSearchFilter;
  setFilter: (filter: TagSearchFilter) => void;
  searchText: string;
  setSearchText: SetSearchFilter;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  tagCount: number;
};

export enum Label {
  All = "All tags",
  Manual = "Manual tags",
  Auto = "Automatic tags",
}

const TagListControls = ({
  currentPage,
  filter,
  searchText,
  setCurrentPage,
  setFilter,
  setSearchText,
  tagCount,
  ...actionBarProps
}: Props): JSX.Element => {
  const loading = useSelector(tagSelectors.loading);
  return (
    <ActionBar
      {...actionBarProps}
      actions={
        <SegmentToggle
          options={[
            {
              title: Label.All,
              value: TagSearchFilter.All,
            },
            {
              title: Label.Manual,
              value: TagSearchFilter.Manual,
            },
            {
              title: Label.Auto,
              value: TagSearchFilter.Auto,
            },
          ]}
          selected={filter}
          onSelect={setFilter}
        />
      }
      currentPage={currentPage}
      itemCount={tagCount}
      loading={loading}
      onSearchChange={setSearchText}
      pageSize={TAGS_PER_PAGE}
      searchFilter={searchText}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default TagListControls;
