import { Icon } from "@canonical/react-components";
import type { Header } from "@tanstack/react-table";

type SortingIndicatorProps<T> = {
  header: Header<T, unknown>;
};

const SortingIndicator = <T,>({ header }: SortingIndicatorProps<T>) =>
  ({
    asc: <Icon name={"chevron-up"}>ascending</Icon>,
    desc: <Icon name={"chevron-down"}>descending</Icon>,
  })[header?.column?.getIsSorted() as string] ?? null;

export default SortingIndicator;
