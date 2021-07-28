import { Col, Link, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { MaasIntroValues } from "../types";

import FormikField from "app/base/components/FormikField";
import IntroCard from "app/intro/components/IntroCard";

const NameCard = (): JSX.Element => {
  const { errors } = useFormikContext<MaasIntroValues>();

  return (
    <IntroCard
      complete={!errors.name}
      data-test="maas-name-form"
      hasErrors={!!errors.name}
      title="Welcome to MAAS"
      titleLink={
        <Link
          external
          href="https://maas.io/docs/configuration-journey"
          target="_blank"
        >
          Help with configuring MAAS
        </Link>
      }
    >
      <Row>
        <Col size={6}>
          <FormikField
            label="Region name"
            name="name"
            placeholder="e.g. us-west"
            type="text"
          />
        </Col>
      </Row>
    </IntroCard>
  );
};

export default NameCard;
