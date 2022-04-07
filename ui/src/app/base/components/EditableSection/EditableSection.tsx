import type { PropsWithSpread } from "@canonical/react-components";
import { Button } from "@canonical/react-components";

import type { Props as TitledSectionProps } from "app/base/components/TitledSection";
import TitledSection from "app/base/components/TitledSection";

type Props = PropsWithSpread<
  {
    canEdit?: boolean;
    editing: boolean;
    setEditing: (editing: boolean) => void;
  },
  TitledSectionProps
>;

export enum Labels {
  EditButton = "Edit",
}

const EditableSection = ({
  canEdit = true,
  editing,
  setEditing,
  ...titledSectionProps
}: Props): JSX.Element => {
  const showEditButton = canEdit && !editing;

  return (
    <TitledSection
      buttons={
        showEditButton ? (
          <Button
            className="u-no-margin--bottom"
            onClick={() => setEditing(true)}
          >
            {Labels.EditButton}
          </Button>
        ) : null
      }
      {...titledSectionProps}
    />
  );
};

export default EditableSection;
