import type { Dispatch, ReactElement, SetStateAction } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { RowSelectionState } from "@tanstack/react-table";

import { useGetConfiguration } from "@/app/api/query/configurations";
import { useImages } from "@/app/api/query/images";
import useImageTableColumns, {
  filterCells,
  filterHeaders,
} from "@/app/images/components/ImagesTable/useImageTableColumns/useImageTableColumns";
import { ConfigNames } from "@/app/store/config/types";

import "./_index.scss";

type ImagesTableProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
  variant?: "full-height" | "regular";
};

const ImagesTable = ({
  selectedRows,
  setSelectedRows,
  variant,
}: ImagesTableProps): ReactElement => {
  const images = useImages();

  const commissioningRelease =
    (useGetConfiguration({
      path: { name: ConfigNames.COMMISSIONING_DISTRO_SERIES },
    }).data?.value as string) ?? "";

  const columns = useImageTableColumns({
    commissioningRelease,
    selectedRows,
    setSelectedRows,
    isStatusLoading: images.stages.statuses.isLoading,
    isStatisticsLoading: images.stages.statistics.isLoading,
  });

  return (
    <GenericTable
      columns={columns}
      data={images.data.items}
      filterCells={filterCells}
      filterHeaders={filterHeaders}
      groupBy={["os"]}
      isLoading={images.stages.images.isLoading}
      noData="No images have been selected to sync."
      pinGroup={[
        { value: "ubuntu", isTop: true },
        { value: "other", isTop: false },
      ]}
      selection={{
        rowSelection: selectedRows,
        setRowSelection: setSelectedRows,
        rowSelectionLabelKey: "title",
        filterSelectable: (row) =>
          row.original.release !== commissioningRelease,
        disabledSelectionTooltip:
          "Cannot modify images of the default commissioning release.",
      }}
      showChevron
      sorting={[{ id: "title", desc: true }]}
      variant={variant}
    />
  );
};

export default ImagesTable;
