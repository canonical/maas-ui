import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ImageListHeader from "./ImageListHeader";

import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import ImagesForms from "@/app/images/components/ImagesForms";
import SMImagesTable from "@/app/images/components/SMImagesTable";
import { bootResourceActions } from "@/app/store/bootresource";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

export enum Labels {
  SyncDisabled = "Automatic image updates are disabled. This may mean that images won't be automatically updated and receive the latest package versions and security fixes.",
}

const ImageList = (): JSX.Element => {
  const dispatch = useDispatch();
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  const configLoaded = useSelector(configSelectors.loaded);
  useWindowTitle("Images");

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: true }));
    dispatch(configActions.fetch());
    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  return (
    <PageContent
      header={<ImageListHeader />}
      sidePanelContent={
        sidePanelContent && (
          <ImagesForms
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getSidePanelTitle("Images", sidePanelContent)}
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
          <SMImagesTable />
        </>
      )}
    </PageContent>
  );
};

export default ImageList;
