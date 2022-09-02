import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import CustomImages from "./CustomImages";
import GeneratedImages from "./GeneratedImages";
import ImageListHeader from "./ImageListHeader";
import SyncedImages from "./SyncedImages";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

export enum Labels {
  SyncDisabled = "Automatic image updates are disabled. This may mean that images won't be automatically updated and receive the latest package versions and security fixes.",
}

const ImageList = (): JSX.Element => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
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
    <Section header={<ImageListHeader />}>
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
          {!!ubuntu && <SyncedImages />}
          <GeneratedImages />
          <CustomImages />
        </>
      )}
    </Section>
  );
};

export default ImageList;
