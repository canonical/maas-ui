import { useState } from "react";

import { Button, Col, Row, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ChangeSource from "./ChangeSource";
import OtherImages from "./OtherImages";
import UbuntuImages from "./UbuntuImages";

import bootResourceSelectors from "app/store/bootresource/selectors";
import type { BootResourceUbuntuSource } from "app/store/bootresource/types";
import { BootResourceSourceType } from "app/store/bootresource/types";

const getImageSyncText = (sources: BootResourceUbuntuSource[]) => {
  if (sources.length === 1) {
    const mainSource = sources[0];
    if (mainSource.source_type === BootResourceSourceType.MAAS_IO) {
      return "maas.io";
    }
    return mainSource.url;
  }
  return "sources";
};

const SyncedImages = (): JSX.Element | null => {
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const sources = ubuntu?.sources || [];
  const hasSources = sources.length !== 0;
  const [showChangeSource, setShowChangeSource] = useState(!hasSources);

  if (!ubuntu) {
    return null;
  }

  return (
    <Strip shallow>
      <Row>
        <Col size="12">
          {showChangeSource ? (
            <ChangeSource
              onCancel={hasSources ? () => setShowChangeSource(false) : null}
            />
          ) : (
            <>
              <div className="u-flex--between">
                <h4 data-test="image-sync-text">
                  Showing images synced from{" "}
                  <strong>{getImageSyncText(sources)}</strong>
                </h4>
                <Button
                  appearance="neutral"
                  onClick={() => setShowChangeSource(true)}
                >
                  Change source
                </Button>
              </div>
              <p>
                Select images to be imported and kept in sync daily. Images will
                be available for deploying to machines managed by MAAS.
              </p>
              <UbuntuImages />
              <OtherImages />
            </>
          )}
        </Col>
      </Row>
    </Strip>
  );
};

export default SyncedImages;
