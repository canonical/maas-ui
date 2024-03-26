import type { ReactNode } from "react";
import { useEffect } from "react";

import { ExternalLink } from "@canonical/maas-react-components";
import type {
  MainTableProps,
  PropsWithSpread,
} from "@canonical/react-components";
import { Icon, MainTable, Strip } from "@canonical/react-components";
import { Link } from "react-router-dom";

import { TAGS_PER_PAGE } from "../constants";

import TableActions from "@/app/base/components/TableActions";
import TableHeader from "@/app/base/components/TableHeader";
import TooltipButton from "@/app/base/components/TooltipButton";
import docsUrls from "@/app/base/docsUrls";
import { useFetchActions, useTableSort } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import urls from "@/app/base/urls";
import { tagActions } from "@/app/store/tag";
import { TagSearchFilter } from "@/app/store/tag/selectors";
import type { Tag } from "@/app/store/tag/types";
import { TagMeta } from "@/app/store/tag/types";
import AppliedTo from "@/app/tags/components/AppliedTo";
import { isComparable } from "@/app/utils";

type Props = PropsWithSpread<
  {
    currentPage: number;
    filter: TagSearchFilter;
    onDelete: (id: Tag[TagMeta.PK], fromDetails?: boolean) => void;
    onUpdate: (id: Tag[TagMeta.PK]) => void;
    searchText: string;
    setCurrentPage: (page: number) => void;
    tags: Tag[];
  },
  MainTableProps
>;

export enum Label {
  Actions = "Actions",
  AppliedTo = "Applied to",
  Auto = "Auto",
  Name = "Tag name",
  Options = "Kernel options",
  Updated = "Last update",
}

export enum TestId {
  NoTags = "no-tags",
}

type SortKey = keyof Tag;

const getSortValue = (sortKey: SortKey, tag: Tag) => {
  const value = tag[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (
  tags: Tag[],
  onDelete: Props["onDelete"],
  onUpdate: Props["onUpdate"]
) =>
  tags.map((tag) => {
    return {
      key: `tag-row-${tag.id}`,
      columns: [
        {
          "aria-label": Label.Name,
          content: (
            <Link to={urls.tags.tag.index({ id: tag.id })}>{tag.name}</Link>
          ),
        },
        {
          "aria-label": Label.Updated,
          content: tag.updated,
        },
        {
          "aria-label": Label.Auto,
          content: !!tag.definition ? (
            <Icon aria-label="Automatic tag" name="success-grey" />
          ) : null,
        },
        {
          "aria-label": Label.AppliedTo,
          content: <AppliedTo id={tag.id} />,
        },
        {
          "aria-label": Label.Options,
          content: !!tag.kernel_opts ? <Icon name="success-grey" /> : null,
        },
        {
          "aria-label": Label.Actions,
          content: (
            <TableActions
              onDelete={() => {
                onDelete(tag[TagMeta.PK]);
              }}
              onEdit={() => onUpdate(tag[TagMeta.PK])}
            />
          ),
          className: "u-align--right",
        },
      ],
      sortData: {
        name: tag.name,
        updated: tag.updated,
      },
    };
  });

const generateNoTagsMessage = (
  noTags: boolean,
  filter: TagSearchFilter,
  searchText: string
) => {
  const hasFilter = filter !== TagSearchFilter.All;
  let noTagsMessage: ReactNode = null;
  if (noTags && (searchText || hasFilter)) {
    let filterName: string | null = null;
    if (hasFilter) {
      filterName = filter === TagSearchFilter.Auto ? "automatic" : "manual";
    }
    let message: string | null = null;
    if (hasFilter && !searchText) {
      message = `There are no ${filterName} tags.`;
    } else if (searchText) {
      message = `No${
        filterName ? ` ${filterName}` : ""
      } tags match the search criteria.`;
    }
    if (message) {
      noTagsMessage = (
        <Strip
          data-testid={TestId.NoTags}
          rowClassName="u-align--center"
          shallow
        >
          {message}
        </Strip>
      );
    }
  }
  return noTagsMessage;
};

const TagTable = ({
  currentPage,
  filter,
  onDelete,
  onUpdate,
  searchText,
  setCurrentPage,
  tags,
  ...tableProps
}: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort<Tag, SortKey>(
    getSortValue,
    {
      key: "name",
      direction: SortDirection.DESCENDING,
    }
  );
  const sortedTags = sortRows(tags);
  const paginatedTags = sortedTags.slice(
    (currentPage - 1) * TAGS_PER_PAGE,
    currentPage * TAGS_PER_PAGE
  );

  useFetchActions([tagActions.fetch]);

  useEffect(() => {
    // Go to the first page if the search text or filters are updated.
    setCurrentPage(1);
  }, [filter, searchText, setCurrentPage]);

  return (
    <>
      <MainTable
        {...tableProps}
        className="p-table-expanding--light"
        headers={[
          {
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("name")}
                sortKey="name"
              >
                {Label.Name}
              </TableHeader>
            ),
          },
          {
            content: (
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("updated")}
                sortKey="updated"
              >
                {Label.Updated}
              </TableHeader>
            ),
          },
          {
            content: (
              <>
                {Label.Auto}{" "}
                <TooltipButton
                  aria-label="More about automatic tags"
                  message={
                    <>
                      Automatic tags are automatically applied to every
                      <br />
                      machine that matches their definition.
                      <br />
                      <ExternalLink
                        className="is-on-dark"
                        to={docsUrls.tagsAutomatic}
                      >
                        Check the documentation about automatic tags.
                      </ExternalLink>
                    </>
                  }
                  position="top-center"
                />
              </>
            ),
          },
          {
            content: Label.AppliedTo,
          },
          {
            content: Label.Options,
          },
          {
            content: Label.Actions,
            className: "u-align--right",
          },
        ]}
        rows={generateRows(paginatedTags, onDelete, onUpdate)}
      />
      {generateNoTagsMessage(tags.length === 0, filter, searchText)}
    </>
  );
};

export default TagTable;
