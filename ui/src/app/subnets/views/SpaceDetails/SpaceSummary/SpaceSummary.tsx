import Definition from "app/base/components/Definition";
import TitledSection from "app/base/components/TitledSection";
import type { Space } from "app/store/space/types";

const SpaceSummary = ({
  name,
  description,
}: Pick<Space, "name" | "description">): JSX.Element => {
  return (
    <TitledSection title="Space summary">
      <Definition label="Name">{name}</Definition>
      <Definition label="Description">{description}</Definition>
    </TitledSection>
  );
};

export default SpaceSummary;
