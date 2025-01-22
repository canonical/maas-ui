import React, { useState } from "react";

import { TableCaption } from "@canonical/maas-react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import ImagesTableHeader from "./ImagesTableHeader";

import GenericTable from "@/app/base/components/GenericTable";
import { useSidePanel } from "@/app/base/side-panel-context";
import useImageTableColumns, {
  filterCells,
  filterHeaders,
} from "@/app/images/components/SMImagesTable/useImageTableColumns/useImageTableColumns";
import { ImageSidePanelViews } from "@/app/images/constants";
import type { Image } from "@/app/images/types";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import type { BootResource } from "@/app/store/bootresource/types";
import { splitResourceName } from "@/app/store/bootresource/utils";
import configSelectors from "@/app/store/config/selectors";

import "./_index.scss";

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

export const SMImagesTable: React.FC = () => {
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.resources);
  const images = getImages(resources);

  const { setSidePanelContent } = useSidePanel();

  const commissioningRelease = useSelector(
    configSelectors.commissioningDistroSeries
  );

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

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
            rowSelection: { ...selectedRows, [row.original.id]: true },
            setRowSelection: setSelectedRows,
          },
        });
      }
    },
  });

  return (
    <>
      {!!ubuntu && (
        <ImagesTableHeader
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      )}
      <GenericTable
        columns={columns}
        data={images}
        filterCells={filterCells}
        filterHeaders={filterHeaders}
        group={["name"]}
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
        rowSelection={selectedRows}
        select
        setRowSelection={setSelectedRows}
        sort={[{ id: "release", desc: true }]}
      />
    </>
  );
};

export default SMImagesTable;
