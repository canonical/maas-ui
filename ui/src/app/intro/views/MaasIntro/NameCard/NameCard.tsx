import { Card, Col, Icon, Link, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { MaasIntroValues } from "../types";

import FormikField from "app/base/components/FormikField";

const NameCard = (): JSX.Element => {
  const { errors } = useFormikContext<MaasIntroValues>();

  return (
    <Card
      className="maas-intro__card"
      data-test="maas-name-form"
      highlighted
      title={
        <>
          <span className="u-flex--between">
            <span className="p-heading--4">
              <Icon name={errors.name ? "error" : "success"} />
              &ensp;Welcome to MAAS
            </span>
            <span className="p-text--default u-text--default-size">
              <Link
                external
                href="https://maas.io/docs/configuration-journey"
                target="_blank"
              >
                Help with configuring MAAS
              </Link>
            </span>
          </span>
          <hr />
        </>
      }
    >
      <Row>
        <Col size="6">
          <FormikField
            label="Region name"
            name="name"
            placeholder="e.g. us-west"
            type="text"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default NameCard;
