import { useState } from "react";

import { Col, Input, Row, Strip } from "@canonical/react-components";

import CustomSource from "./CustomSource";

import { BootResourceSourceType } from "app/store/bootresource/types";

const UbuntuImages = (): JSX.Element => {
  const [sourceType, setSourceType] = useState<BootResourceSourceType>(
    BootResourceSourceType.MAAS_IO
  );

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
      {sourceType === BootResourceSourceType.CUSTOM && <CustomSource />}
    </Strip>
  );
};

export default UbuntuImages;
