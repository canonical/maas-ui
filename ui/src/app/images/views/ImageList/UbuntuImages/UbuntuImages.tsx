import { useState } from "react";

import { Col, Input, Row, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CustomSource from "./CustomSource";
import DefaultSource from "./DefaultSource";

import bootResourceSelectors from "app/store/bootresource/selectors";
import { BootResourceSourceType } from "app/store/bootresource/types";

const UbuntuImages = (): JSX.Element | null => {
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const [sourceType, setSourceType] = useState<BootResourceSourceType>(
    BootResourceSourceType.MAAS_IO
  );

  if (!ubuntu) {
    return null;
  }

  return (
    <Strip shallow>
      <Row>
        <Col size="12">
          <h4>Ubuntu</h4>
          <hr />
          <p>
            Select images to be imported and kept in sync daily. Images will be
            available for deploying to machines managed by MAAS.
          </p>
          <h4>Choose source</h4>
          <ul className="p-inline-list">
            <li className="p-inline-list__item u-display-inline-block">
              <Input
                checked={sourceType === BootResourceSourceType.MAAS_IO}
                id="maas-source"
                label="maas.io"
                onChange={() => setSourceType(BootResourceSourceType.MAAS_IO)}
                type="radio"
              />
            </li>
            <li className="p-inline-list__item u-display-inline-block u-nudge-right">
              <Input
                checked={sourceType === BootResourceSourceType.CUSTOM}
                id="custom-source"
                label="Custom"
                onChange={() => setSourceType(BootResourceSourceType.CUSTOM)}
                type="radio"
              />
            </li>
          </ul>
        </Col>
      </Row>
      {sourceType === BootResourceSourceType.MAAS_IO && <DefaultSource />}
      {sourceType === BootResourceSourceType.CUSTOM && <CustomSource />}
    </Strip>
  );
};

export default UbuntuImages;
