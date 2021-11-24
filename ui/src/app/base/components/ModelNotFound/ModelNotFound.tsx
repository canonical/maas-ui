import { Link } from "react-router-dom";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { capitaliseFirst } from "app/utils";

type Props = {
  id: number | string;
  linkText?: string;
  linkURL: string;
  modelName: string;
};

const ModelNotFound = ({
  id,
  linkText,
  linkURL,
  modelName,
}: Props): JSX.Element => {
  return (
    <Section
      data-test="not-found"
      header={
        <SectionHeader title={`${capitaliseFirst(modelName)} not found`} />
      }
    >
      <p>
        Unable to find a {modelName} with id "{id}".{" "}
        <Link to={linkURL}>{linkText || `View all ${modelName}s`}</Link>.
      </p>
    </Section>
  );
};

export default ModelNotFound;
