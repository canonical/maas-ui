import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ImageListHeader from "./ImageListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions as bootResourceActions } from "app/store/bootresource";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const ImagesList = (): JSX.Element => {
  const dispatch = useDispatch();
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  useWindowTitle("Images");

  useEffect(() => {
    dispatch(bootResourceActions.poll());
    dispatch(configActions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={<ImageListHeader />}
      headerClassName="u-no-padding--bottom"
    >
      {!autoImport && (
        <Notification data-test="disabled-sync-warning" type="caution">
          Automatic image updates are disabled. This may mean that images won't
          be automatically updated and receive the latest package versions and
          security fixes.
        </Notification>
      )}
      Images
    </Section>
  );
};

export default ImagesList;
