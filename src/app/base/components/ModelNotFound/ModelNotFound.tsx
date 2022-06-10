import { Link } from "react-router-dom-v5-compat";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { capitaliseFirst, isId } from "app/utils";

type Props = {
  id?: number | string | null;
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
  const message = isId(id)
    ? `Unable to find a ${modelName} with id "${id}".`
    : `Unable to find this ${modelName}.`;
  return (
    <Section
      data-testid="not-found"
      header={
        <SectionHeader title={`${capitaliseFirst(modelName)} not found`} />
      }
    >
      <p>
        {message}{" "}
        <Link to={linkURL}>{linkText || `View all ${modelName}s`}</Link>.
      </p>
    </Section>
  );
};

export default ModelNotFound;
