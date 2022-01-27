import { Button, Strip } from "@canonical/react-components";

import type { Space } from "app/store/space/types";

type SpaceDeleteProps = {
  handleDelete?: () => void;
  handleCancel?: () => void;
} & Pick<Space, "id" | "name">;

const SpaceDelete = ({
  name,
  handleDelete,
  handleCancel,
}: SpaceDeleteProps): JSX.Element => {
  return (
    <Strip shallow element="section" className="u-align--right">
      <p className="u-align-text--right">
        Are you sure you want to delete {name} space?
      </p>
      <Button appearance="negative" onClick={handleDelete}>
        Yes, delete space
      </Button>
      <Button onClick={handleCancel}>No, cancel</Button>
    </Strip>
  );
};

export default SpaceDelete;
