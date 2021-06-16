import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ImageListHeader from "./ImageListHeader";
import OtherImages from "./OtherImages";
import UbuntuImages from "./UbuntuImages";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const ImagesList = (): JSX.Element => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const otherImages = useSelector(bootResourceSelectors.otherImages);
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  const configLoaded = useSelector(configSelectors.loaded);
  useWindowTitle("Images");

  useEffect(() => {
    dispatch(bootResourceActions.poll());
    dispatch(configActions.fetch());
    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  if (!configLoaded) {
    // Dummy section is displayed while config is loading to prevent header
    // content jumping around.
    return <Section data-test="placeholder-section" header="Images" />;
  }

  const showUbuntuImages = ubuntu !== null;
  const showOtherImages = otherImages.length > 0;
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
      {showUbuntuImages && <UbuntuImages />}
      {showUbuntuImages && showOtherImages && <hr />}
      {showOtherImages && <OtherImages />}
    </Section>
  );
};

export default ImagesList;
