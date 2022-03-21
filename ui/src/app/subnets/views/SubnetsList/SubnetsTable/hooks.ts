import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { SUBNETS_TABLE_ITEMS_PER_PAGE } from "./constants";
import type { SubnetsTableRow, GroupByKey } from "./types";
import { getTableData } from "./utils";

import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

export const useSubnetsTable = (
  groupBy: GroupByKey = "fabric"
): {
  rows: SubnetsTableRow[];
} => {
  const dispatch = useDispatch();
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlans = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const subnets = useSelector(subnetSelectors.all);
  const spaces = useSelector(spaceSelectors.all);
  const spacesLoaded = useSelector(spaceSelectors.loaded);
  const loaded = fabricsLoaded && vlansLoaded && subnetsLoaded && spacesLoaded;

  const [rows, setRows] = useState<SubnetsTableRow[]>([]);

  useEffect(() => {
    if (!fabricsLoaded) dispatch(fabricActions.fetch());
    if (!vlansLoaded) dispatch(vlanActions.fetch());
    if (!subnetsLoaded) dispatch(subnetActions.fetch());
    if (!spacesLoaded) dispatch(spaceActions.fetch());
  }, [dispatch, fabricsLoaded, vlansLoaded, subnetsLoaded, spacesLoaded]);

  useEffect(() => {
    if (loaded) {
      setRows(getTableData({ fabrics, vlans, subnets, spaces }, groupBy));
    }
  }, [loaded, fabrics, vlans, subnets, spaces, setRows, groupBy]);

  return { rows };
};

export function usePagination<D>(
  data: Array<D>,
  itemsPerPage = SUBNETS_TABLE_ITEMS_PER_PAGE
): {
  pageData: Array<D>;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  itemsPerPage: number;
  totalItems: number;
} {
  const totalItems = data.length;
  const [pageIndex, setPageIndex] = useState(0);
  const startIndex = pageIndex * itemsPerPage;
  const paginate = (pageNumber: number) => setPageIndex(pageNumber - 1);

  useEffect(() => {
    // go to the last available page if the current page is out of bounds
    if (startIndex >= totalItems) {
      Math.floor(totalItems / itemsPerPage) > 0
        ? setPageIndex(Math.floor(totalItems / itemsPerPage) - 1)
        : setPageIndex(0);
    }
  }, [pageIndex, startIndex, setPageIndex, totalItems, itemsPerPage]);

  const pageData = useMemo(
    () => data?.slice(startIndex, startIndex + itemsPerPage),
    [startIndex, data, itemsPerPage]
  );

  return {
    pageData,
    currentPage: pageIndex + 1,
    paginate,
    itemsPerPage,
    totalItems,
  };
}
