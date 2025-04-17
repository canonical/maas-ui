import type { Dispatch, SetStateAction } from "react";

import { TableCaption } from "@canonical/maas-react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import GenericTable from "@/app/base/components/GenericTable";
import { useSidePanel } from "@/app/base/side-panel-context";
import useImageTableColumns, {
  filterCells,
  filterHeaders,
} from "@/app/images/components/ImagesTable/useImageTableColumns/useImageTableColumns";
import { ImageSidePanelViews } from "@/app/images/constants";
import type { Image } from "@/app/images/types";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import type { BootResource } from "@/app/store/bootresource/types";
import { splitResourceName } from "@/app/store/bootresource/utils";
import configSelectors from "@/app/store/config/selectors";

import "./_index.scss";

type SMImagesTableProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
  variant?: "full-height" | "regular";
};

const getImages = (resources: BootResource[]): Image[] => {
  return resources.map((resource) => {
    const { os } = splitResourceName(resource.name);
    return {
      id: resource.id,
      release: resource.title,
      architecture: resource.arch,
      name: os[0].toUpperCase() + os.slice(1),
      size: resource.size,
      lastSynced: resource.lastUpdate,
      canDeployToMemory: resource.canDeployToMemory,
      status: resource.status,
      lastDeployed: resource.lastDeployed,
      machines: resource.machineCount,
      resource: resource,
    };
  });
};

const ImagesTable = ({
  selectedRows,
  setSelectedRows,
  variant,
}: SMImagesTableProps) => {
  const resources = useSelector(bootResourceSelectors.resources);
  const isPolling = useSelector(bootResourceSelectors.polling);
  const images = getImages(resources);

  const { setSidePanelContent } = useSidePanel();

  const commissioningRelease = useSelector(
    configSelectors.commissioningDistroSeries
  );

  const columns = useImageTableColumns({
    commissioningRelease,
    onDelete: (row) => {
      if (row.original.id) {
        if (!row.getIsSelected()) {
          row.toggleSelected();
        }
        setSidePanelContent({
          view: ImageSidePanelViews.DELETE_MULTIPLE_IMAGES,
          extras: {
            rowSelection: { ...selectedRows, [row.id]: true },
            setRowSelection: setSelectedRows,
          },
        });
      }
    },
  });

  return (
    <GenericTable
      canSelect
      columns={columns}
      data={images}
      filterCells={filterCells}
      filterHeaders={filterHeaders}
      groupBy={["name"]}
      isLoading={isPolling && images.length === 0}
      noData={
        <TableCaption>
          <TableCaption.Title>No images</TableCaption.Title>
          <TableCaption.Description>
            There are no images stored in Site Manager at the moment. You can
            either upload images, or connect to an upstream image source to
            download images from.
          </TableCaption.Description>
        </TableCaption>
      }
      pinGroup={[
        { value: "Ubuntu", isTop: true },
        { value: "Other", isTop: false },
      ]}
      rowSelection={selectedRows}
      setRowSelection={setSelectedRows}
      sortBy={[{ id: "release", desc: true }]}
      variant={variant}
    />
  );
};

export default ImagesTable;
