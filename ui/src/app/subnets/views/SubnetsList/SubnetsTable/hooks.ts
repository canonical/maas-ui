import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { SUBNETS_TABLE_ITEMS_PER_PAGE } from "./constants";
import type { SubnetsTableRow, GroupByKey } from "./types";
import { filterSubnetsBySearchText, getTableData } from "./utils";

import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type UseSubnetsTable = {
  data: SubnetsTableRow[];
  loaded: boolean;
};

export const useSubnetsTable = (
  groupBy: GroupByKey = "fabric"
): UseSubnetsTable => {
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

  const [state, setState] = useState<UseSubnetsTable>({
    data: [],
    loaded: false,
  });

  useEffect(() => {
    if (!fabricsLoaded) dispatch(fabricActions.fetch());
    if (!vlansLoaded) dispatch(vlanActions.fetch());
    if (!subnetsLoaded) dispatch(subnetActions.fetch());
    if (!spacesLoaded) dispatch(spaceActions.fetch());
  }, [dispatch, fabricsLoaded, vlansLoaded, subnetsLoaded, spacesLoaded]);

  useEffect(() => {
    if (loaded) {
      setState({
        data: getTableData({ fabrics, spaces, subnets, vlans }, groupBy),
        loaded: true,
      });
    }
  }, [loaded, fabrics, vlans, subnets, spaces, groupBy]);

  return state;
};

export const useSubnetsTableSearch = (
  subnetsTable: { data: SubnetsTableRow[]; loaded: boolean },
  searchText: string
): UseSubnetsTable => {
  const [state, setState] = useState<UseSubnetsTable>({
    data: [],
    loaded: false,
  });

  useEffect(() => {
    if (subnetsTable.loaded) {
      setState({
        data: filterSubnetsBySearchText(subnetsTable.data, searchText),
        loaded: true,
      });
    }
  }, [subnetsTable, searchText]);

  return state;
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
    currentPage: pageIndex + 1,
    itemsPerPage,
    pageData,
    paginate,
    totalItems,
  };
}
