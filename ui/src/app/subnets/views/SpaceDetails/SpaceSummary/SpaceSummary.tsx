import { Strip } from "@canonical/react-components";

import Definition from "app/base/components/Definition";
import { useId } from "app/base/hooks/base";
import type { Space } from "app/store/space/types";

const SpaceSummary = ({
  name,
  description,
}: Pick<Space, "name" | "description">): JSX.Element => {
  const id = useId();
  return (
    <Strip shallow element="section" aria-labelledby={id}>
      <h2 id={id} className="p-heading--4">
        Space summary
      </h2>
      <Definition label="Name">{name}</Definition>
      <Definition label="Description">{description}</Definition>
    </Strip>
  );
};

export default SpaceSummary;
