import React from "react";

import { MainTable } from "@canonical/react-components";

import type { NormalisedStorageDevice as StorageDevice } from "../types";
import { formatSize } from "../utils";

import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";

const getSortValue = (
  sortKey: keyof StorageDevice,
  storageDevice: StorageDevice
) => storageDevice[sortKey];

type Props = { cacheSets: StorageDevice[] };

const CacheSetsTable = ({ cacheSets }: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort(getSortValue, {
    key: "name",
    direction: "descending",
  });
  // TODO: update useTableSort to TS with generics
  // https://github.com/canonical-web-and-design/maas-ui/issues/1869
  const sortedCacheSets = sortRows(cacheSets) as StorageDevice[];

  return (
    <MainTable
      headers={[
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("name")}
                sortKey="name"
              >
                Name
              </TableHeader>
            </>
          ),
        },
        {
          content: (
            <TableHeader
              currentSort={currentSort}
              onClick={() => updateSort("size")}
              sortKey="size"
            >
              Size
            </TableHeader>
          ),
        },
        {
          content: <TableHeader>Used for</TableHeader>,
        },
        {
          className: "u-align--right",
          content: "Actions",
        },
      ]}
      rows={sortedCacheSets.map((cacheSet) => {
        return {
          columns: [
            {
              content: <span data-test="name">{cacheSet.name}</span>,
            },
            {
              content: (
                <span data-test="size">{formatSize(cacheSet.size)}</span>
              ),
            },
            {
              content: (
                <span data-test="used-for">{cacheSet.usedFor || "—"}</span>
              ),
            },
            {
              content: "",
            },
          ],
          key: cacheSet.id,
        };
      })}
    />
  );
};

export default CacheSetsTable;
