import { Strip } from "@canonical/react-components";
import { nanoid } from "nanoid";

import Definition from "app/base/components/Definition";
import type { Space } from "app/store/space/types";

const SpaceSummary = ({
  name,
  description,
}: Pick<Space, "name" | "description">): JSX.Element => {
  const id = nanoid();
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
