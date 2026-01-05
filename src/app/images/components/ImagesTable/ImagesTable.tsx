import type { Dispatch, ReactElement, SetStateAction } from "react";

import { GenericTable, TableCaption } from "@canonical/maas-react-components";
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

  const commissioningRelease = useGetConfiguration({
    path: { name: ConfigNames.COMMISSIONING_DISTRO_SERIES },
  });

  const columns = useImageTableColumns({
    commissioningRelease: (commissioningRelease.data?.value as string) ?? "",
    selectedRows,
    setSelectedRows,
  });

  return (
    <GenericTable
      columns={columns}
      data={images.data.items}
      filterCells={filterCells}
      filterHeaders={filterHeaders}
      groupBy={["os"]}
      isLoading={images.isLoading}
      noData={
        <TableCaption.Description>
          No images have been selected to sync.
        </TableCaption.Description>
      }
      pinGroup={[
        { value: "Ubuntu", isTop: true },
        { value: "Other", isTop: false },
      ]}
      selection={{
        rowSelection: selectedRows,
        setRowSelection: setSelectedRows,
        rowSelectionLabelKey: "release",
      }}
      showChevron
      sorting={[{ id: "release", desc: true }]}
      variant={variant}
    />
  );
};

export default ImagesTable;
