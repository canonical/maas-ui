import { Button, Strip, Notification } from "@canonical/react-components";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { actions as spaceActions } from "app/store/space";
import type { Space } from "app/store/space/types";
import { getCanBeDeleted } from "app/store/space/utils";
import { getNetworksLocation } from "app/subnets/urls";

type SpaceDeleteProps = {
  space: Space;
  handleClose?: () => void;
};

const SpaceDelete = ({ space, handleClose }: SpaceDeleteProps): JSX.Element => {
  const canBeDeleted = getCanBeDeleted(space);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleDelete = () => {
    dispatch(spaceActions.delete(space.id));
    history.replace(getNetworksLocation({ by: "space" }));
  };

  return (
    <Strip shallow element="section">
      {canBeDeleted ? (
        <div className="u-align--right">
          <p className="u-align-text--right">
            Are you sure you want to delete {space.name} space?
          </p>
          <Button appearance="negative" onClick={handleDelete}>
            Yes, delete space
          </Button>
          <Button onClick={handleClose}>No, cancel</Button>
        </div>
      ) : (
        <Notification
          inline
          severity="negative"
          title="Error:"
          onDismiss={handleClose}
        >
          Space cannot be deleted because it has subnets attached. Remove all
          subnets from the space to allow deletion.
        </Notification>
      )}
    </Strip>
  );
};

export default SpaceDelete;
