import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Notification } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch } from "react-redux";

import ImageListHeader from "./ImageListHeader";

import { useGetConfiguration } from "@/app/api/query/configurations";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import ImagesTable from "@/app/images/components/ImagesTable";
import { bootResourceActions } from "@/app/store/bootresource";
import { ConfigNames } from "@/app/store/config/types";

export enum Labels {
  SyncDisabled = "Automatic image updates are disabled. This may mean that images won't be automatically updated and receive the latest package versions and security fixes.",
}

const ImageList = (): ReactElement => {
  const dispatch = useDispatch();
  const { data, isPending } = useGetConfiguration({
    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
  });
  const autoImport = data?.value as boolean;
  const configLoaded = !isPending;

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

  useWindowTitle("Images");

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: true }));
    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  return (
    <PageContent
      header={
        <ImageListHeader
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      }
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      {configLoaded && (
        <>
          {!autoImport && (
            <Notification
              data-testid="disabled-sync-warning"
              severity="caution"
            >
              {Labels.SyncDisabled}
            </Notification>
          )}
          <ImagesTable
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </>
      )}
    </PageContent>
  );
};

export default ImageList;
