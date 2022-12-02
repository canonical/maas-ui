import { useEffect, useRef } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { ControllerMeta, ImageSyncStatus } from "app/store/controller/types";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

export const ImageStatus = ({ systemId }: Props): JSX.Element | null => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  const dispatch = useDispatch();
  const pollId = useRef(nanoid());
  const status = useSelector((state: RootState) =>
    controllerSelectors.imageSyncStatusesForController(
      state,
      controller?.system_id
    )
  );
  const checkingImages = useSelector((state: RootState) =>
    controllerSelectors.getStatusForController(
      state,
      controller?.system_id || null,
      "checkingImages"
    )
  );

  useEffect(() => {
    const id = pollId.current;
    if (controller) {
      dispatch(
        controllerActions.pollCheckImages([controller[ControllerMeta.PK]], id)
      );
    }
    return () => {
      dispatch(controllerActions.pollCheckImagesStop(id));
    };
  }, [dispatch, controller]);

  if (!controller) {
    return null;
  }
  if (checkingImages) {
    return <Spinner />;
  }
  return (
    <>
      {status === ImageSyncStatus.Synced && (
        <>
          <Icon data-testid="sync-success-icon" name="success-grey" />{" "}
        </>
      )}
      <span data-testid="status">{status ?? "Asking for status..."}</span>
    </>
  );
};

export default ImageStatus;
